<template>
  <main class="page">
    <div class="wrap">
      <button class="back" @click="goBack">← Назад</button>

      <h1 class="title">{{ story?.title }}</h1>

      <div v-if="story" class="storyImageWrap">
        <img class="storyImage" :src="currentImage" :alt="story.title" />
      </div>

      <div v-if="story" class="box">
        <div class="audioWrap">
          <audio
              ref="audioEl"
              :src="`${BASE}audio/${story.id}.mp3`"
              controls
              preload="metadata"
              @loadedmetadata="onLoadedMeta"
              @timeupdate="onTimeUpdate"
              @seeking="onTimeUpdate"
              @seeked="onTimeUpdate"
          />
          <div class="hint"></div>
        </div>

        <div class="textWrap" ref="textRoot">
          <template v-for="(sent, si) in sentences" :key="si">
            <p class="sentence" :class="{ activeSentence: si === activeSentenceIndex }">
              <span
                  v-for="(w, wi) in sent.words"
                  :key="`${si}-${wi}`"
                  :ref="el => registerWordEl(el, si, wi)"
                  class="word"
                  :class="{
                  activeWord: si === activeSentenceIndex && wi === activeWordIndex,
                  spokenWord: isWordSpoken(si, wi)
                }"
              >
                {{ w.text }}<span class="space">{{ w.space }}</span>
              </span>
            </p>
          </template>
        </div>
      </div>

      <p v-else>Оваа приказна не постои.</p>

      <RouterLink class="home" to="/">🏠 Почетна</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, reactive, watch, nextTick } from "vue"
import { useRoute, useRouter } from "vue-router"
import { stories } from "../data/stories"

const BASE = import.meta.env.BASE_URL
const PAUSE_FRACTION = 0.22
const MIN_WORD_SEC = 0.30
const MAX_WORD_SEC = 1.20
const PUNCT_PAUSE_BOOST = 1.7

const route = useRoute()
const router = useRouter()

const story = computed(() => stories.find(s => s.id === route.params.id))

const audioEl = ref(null)
const textRoot = ref(null)

const activeSentenceIndex = ref(-1)
const activeWordIndex = ref(-1)


const wordSec = ref(0.6)

const timeline = reactive({
  totalDuration: 0,
  sentences: []
})


const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (!story.value) return ""

  return `${BASE}story-images/${story.value.id}/${currentImageIndex.value + 1}.jpg`
})


const sentences = computed(() => {
  if (!story.value) return []

  const lines = (story.value.text || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean)

  return lines.map(raw => {
    const parts = raw.split(/\s+/).filter(Boolean)
    const words = parts.map((t, i) => ({
      text: t,
      space: i === parts.length - 1 ? "" : " "
    }))
    return { raw, words }
  })
})

const totalWords = computed(() =>
    sentences.value.reduce((sum, s) => sum + s.words.length, 0)
)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.push("/")
}

function onLoadedMeta() {
  const dur = audioEl.value?.duration || 1
  computeAutoWordSec(dur)
  buildTimeline(dur)
  onTimeUpdate()
}

watch(
    () => story.value?.id,
    async () => {
      timeline.sentences = []
      timeline.totalDuration = 0
      activeSentenceIndex.value = -1
      activeWordIndex.value = -1
      currentImageIndex.value = 0
      wordEls.clear()

      await nextTick()
      if (audioEl.value?.duration) {
        const dur = audioEl.value.duration
        computeAutoWordSec(dur)
        buildTimeline(dur)
        onTimeUpdate()
      }
    },
    { immediate: true }
)

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v))
}

function computeAutoWordSec(audioDurationSec) {
  const tw = totalWords.value || 1
  const usable = audioDurationSec * (1 - PAUSE_FRACTION)
  const spw = usable / tw
  wordSec.value = clamp(spw, MIN_WORD_SEC, MAX_WORD_SEC)
}

function buildTimeline(audioDurationSec) {
  timeline.sentences = []

  const sents = sentences.value
  if (!sents.length) return

  const duration = Number.isFinite(audioDurationSec) && audioDurationSec > 0 ? audioDurationSec : 1
  timeline.totalDuration = duration

  const weights = sents.map(s => {
    const len = s.raw.length
    const wc = s.words.length

    const commas = (s.raw.match(/,/g) || []).length
    const dots = (s.raw.match(/[\.…]/g) || []).length
    const strong = (s.raw.match(/[!?]/g) || []).length
    const quotes = (s.raw.match(/[„“"]/g) || []).length

    const pauseBonus =
        PUNCT_PAUSE_BOOST * (commas * 10 + dots * 18 + strong * 26 + quotes * 6)

    return Math.max(12, len + wc * 7 + pauseBonus)
  })

  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1

  let acc = 0
  for (let i = 0; i < sents.length; i++) {
    const sentDur = (weights[i] / totalWeight) * duration
    const start = acc
    const end = acc + sentDur

    const n = sents[i].words.length
    const desired = wordSec.value * n
    const scale = desired > sentDur ? (sentDur / desired) : 1
    const perWord = wordSec.value * scale

    const sentWords = []
    let wAcc = start
    for (let j = 0; j < n; j++) {
      const wStart = wAcc
      const wEnd = wAcc + perWord

      sentWords.push({
        text: sents[i].words[j].text,
        space: sents[i].words[j].space,
        start: wStart,
        end: wEnd
      })

      wAcc = wEnd
    }

    timeline.sentences.push({ start, end, words: sentWords })
    acc = end
  }
}

function onTimeUpdate() {
  const a = audioEl.value
  if (!a) return

  const t = a.currentTime || 0


  const dur = a.duration || timeline.totalDuration || 1
  const p = t / Math.max(0.001, dur)

  if (p < 0.25) currentImageIndex.value = 0
  else if (p < 0.5) currentImageIndex.value = 1
  else if (p < 0.75) currentImageIndex.value = 2
  else currentImageIndex.value = 3


  if (!timeline.sentences.length) return

  let si = timeline.sentences.findIndex(s => t >= s.start && t < s.end)
  if (si === -1) si = t >= timeline.totalDuration ? timeline.sentences.length - 1 : 0
  const sent = timeline.sentences[si]

  let wi = sent.words.findIndex(w => t >= w.start && t < w.end)
  if (wi === -1) wi = t >= sent.end ? Math.max(0, sent.words.length - 1) : 0

  const changed = si !== activeSentenceIndex.value || wi !== activeWordIndex.value
  activeSentenceIndex.value = si
  activeWordIndex.value = wi

  if (changed) scrollActiveInsideTextWrap()
}

function isWordSpoken(si, wi) {
  const a = audioEl.value
  if (!a) return false
  const t = a.currentTime || 0
  const s = timeline.sentences[si]
  const w = s?.words?.[wi]
  return !!w && t >= w.end
}

const wordEls = new Map()

function registerWordEl(el, si, wi) {
  if (!el) return
  wordEls.set(`${si}-${wi}`, el)
}

function scrollActiveInsideTextWrap() {
  const container = textRoot.value
  const el = wordEls.get(`${activeSentenceIndex.value}-${activeWordIndex.value}`)
  if (!container || !el) return


  const cRect = container.getBoundingClientRect()
  const eRect = el.getBoundingClientRect()


  const elTopInside = (eRect.top - cRect.top) + container.scrollTop
  const target = elTopInside - container.clientHeight / 2


  container.scrollTo({ top: Math.max(0, target), behavior: "smooth" })
}
</script>

<style scoped>
.page { padding: 40px 18px; }
.wrap { max-width: 900px; margin: 0 auto; }

.back{
  border:none;
  background:#eef7ff;
  padding:10px 14px;
  border-radius:12px;
  font-weight:800;
  cursor:pointer;
}

.title{ margin:18px 0 14px; font-size:34px; }


.storyImageWrap{
  margin: 10px 0 16px;
  border-radius: 18px;
  border: 1px solid #cfe7ff;
  background: #f3f8ff;
  overflow: hidden;
}
.storyImage{
  width: 100%;
  height: 360px;
  object-fit: contain;
  display: block;
}

.box{
  background:#eaf4ff;
  border:1px solid #cfe7ff;
  border-radius:22px;
  padding:18px;
}

.audioWrap{
  background:#fff;
  border:1px solid #d6ecff;
  border-radius:16px;
  padding:12px;
  margin-bottom:12px;
}
audio{ width:100%; }

.textWrap{
  background:#eaf4ff;
  border:1px solid #cfe7ff;
  border-radius:18px;
  padding:16px;
  max-height:420px;
  overflow:auto;
}

.sentence{
  margin:0 0 12px;
  line-height:1.9;
  font-size:19px;
  padding:10px 10px;
  border-radius:14px;
}

.activeSentence{ background: rgba(255,224,102,0.22); }

.word{
  display:inline;
  border-radius:8px;
  padding:2px 2px;
  transition: background 140ms ease, transform 140ms ease, opacity 140ms ease;
}
.word .space{ white-space: pre; }

.spokenWord{ opacity:0.6; }

.activeWord{
  background:#ffe066;
  padding:2px 5px;
  transform: translateY(-1px);
  box-shadow: 0 2px 0 rgba(0,0,0,0.08);
}

.home{
  display:inline-block;
  margin-top:16px;
  font-weight:900;
  text-decoration:none;
  color:#1f78b4;
}
</style>