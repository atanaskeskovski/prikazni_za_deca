<template>
  <main class="home">

    <section id="home" class="hero">
      <div class="overlay"></div>

      <div class="hero-content">
        <h1>Бесплатни и оригинални приказни за деца!</h1>
        <p>Приказни на македонски јазик за најмладите.</p>

        <div class="hero-buttons">
          <button @click="scrollToAge">Прелистај по возраст</button>
          <button class="outline" @click="showAllStories">Сите приказни</button>
        </div>
      </div>
    </section>

    <!-- AGE -->
    <section id="age" class="age">
      <div class="section-inner">
        <h2>Прелистај приказни според возраст</h2>

        <div class="age-buttons">
          <button @click="selectAge('3-5')">За деца 3–5 години</button>
          <button @click="selectAge('5-8')">За деца 5–8 години</button>
        </div>
      </div>
    </section>

    <!-- STORIES -->
    <section id="stories" class="stories">
      <div class="section-inner">
        <h2 v-if="currentAge === '3-5'">Приказни за деца 3–5 години</h2>
        <h2 v-else-if="currentAge === '5-8'">Приказни за деца 5–8 години</h2>
        <h2 v-else>Сите приказни</h2>

        <div class="story-grid">
          <article
              v-for="s in visibleStories"
              :key="s.id"
              class="story"
              @click="openStory(s.id)"
          >
            <h3>{{ s.title }}</h3>
            <p>{{ s.preview }}</p>
            <div class="read">Читај</div>
          </article>
        </div>
      </div>
    </section>

    <!-- EXTRA SECTION: WHY + QUOTE + CTA -->
    <section class="extras">
      <div class="section-inner">

        <div class="why">
          <h2 class="extrasTitle">Зошто да читаме приказни?</h2>

          <div class="whyGrid">
            <div class="whyCard">
              <div class="icon">🧠</div>
              <h3>Фантазија и говор</h3>
              <p>Приказните ја развиваат фантазијата и го збогатуваат вокабуларот.</p>
            </div>

            <div class="whyCard">
              <div class="icon">❤️</div>
              <h3>Емпатија и добрина</h3>
              <p>Децата учат да разбираат чувства и да бидат внимателни кон другите.</p>
            </div>

            <div class="whyCard">
              <div class="icon">📚</div>
              <h3>Навика за читање</h3>
              <p>Кога читањето е забавно, станува омилена навика од мали нозе.</p>
            </div>
          </div>
        </div>

        <div class="quote">
          <p class="quoteText">
            „Најголемата утеха е само да бидеш до некого.“
          </p>
          <div class="quoteBy">— од нашите приказни</div>
        </div>

        <div class="cta">
          <h3>Имаш идеја за нова приказна?</h3>
          <p>Прати ни предлог и помогни да создадеме уште повеќе убави приказни за деца.</p>

          <div class="ctaActions">
            <button class="ctaBtn" @click="goToContact">Предложи приказна</button>
            <button class="ctaBtn ghost" @click="goToAbout">За нас</button>
          </div>
        </div>

      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <span>© 2026 Бесплатни детски приказни</span>
      </div>
    </footer>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from '../data/stories'

const router = useRouter()

const currentAge = ref(null)
const showAll = ref(false)

function scrollToAge() {
  document.getElementById('age')?.scrollIntoView({ behavior: 'smooth' })
}

function showAllStories() {
  showAll.value = true
  currentAge.value = null
  document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })
}

function selectAge(age) {
  currentAge.value = age
  showAll.value = false
  document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })
}

const visibleStories = computed(() => {
  if (showAll.value || !currentAge.value) return stories
  return stories.filter(s => s.age === currentAge.value)
})

function openStory(id) {
  router.push(`/prikazna/${id}`)
}

function goToContact() {
  // ако немаш id="contact" на /za-nas, смени во router.push('/za-nas')
  router.push('/za-nas#contact')
}

function goToAbout() {
  router.push('/za-nas')
}
</script>

<style scoped>
.home { width: 100%; margin: 0; padding: 0; }

.hero{
  position:relative;
  min-height:480px;
  width:100%;
  margin:0;
  background:url('../assets/background1.jpg') center/cover no-repeat;
  color:#fff;
}

.overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.25));
}

.hero-content{
  position:relative;
  z-index:1;
  max-width:900px;
  margin:0 auto;
  padding:120px 20px;
  text-align:center;
}

.hero h1{
  font-size:44px;
  margin-bottom:16px;
  font-family: Georgia, "Times New Roman", serif;
}

.hero p{ opacity:0.95; }

.hero-buttons button{
  margin:8px;
  padding:14px 26px;
  border-radius:999px;
  border:none;
  font-weight:800;
  cursor:pointer;
}

.hero-buttons .outline{
  background:transparent;
  color:#fff;
  border:2px solid #fff;
}

.section-inner{
  max-width:1200px;
  margin:0 auto;
  padding:0 20px;
}

.age{
  padding:80px 0 40px;
  text-align:center;
}

.age-buttons button{
  margin:10px;
  padding:14px 26px;
  border-radius:999px;
  border:2px solid #4f46e5;
  background:transparent;
  font-weight:800;
  cursor:pointer;
}

.stories{ padding:40px 0; }

.story-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:20px;
}

.story{
  border:1px solid #ddd;
  border-radius:18px;
  padding:18px;
  cursor:pointer;
  background:#fff;
}

.read{
  margin-top:10px;
  display:inline-block;
  padding:10px 14px;
  border-radius:12px;
  border:2px solid #4f46e5;
  font-weight:800;
}

/* ===== EXTRAS ===== */
.extras{
  margin-top: 10px;
  padding: 70px 0;
  background: #f6f7fb;
  border-top: 1px solid #e9eaf2;
}

.extrasTitle{
  text-align:center;
  margin: 0 0 22px;
  font-size: 34px;
  font-weight: 900;
}

.whyGrid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.whyCard{
  background:#fff;
  border: 1px solid #e6e6ee;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.06);
}

.icon{
  font-size: 32px;
  margin-bottom: 8px;
}

.whyCard h3{
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 900;
}

.whyCard p{
  margin: 0;
  color: #444;
  line-height: 1.7;
}

.quote{
  margin: 26px 0;
  background: #ffffff;
  border: 1px dashed #cfd5ff;
  border-radius: 18px;
  padding: 18px;
  text-align:center;
}

.quoteText{
  margin: 0;
  font-size: 20px;
  font-style: italic;
  font-weight: 800;
  color: #2b2b2b;
}

.quoteBy{
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.75;
}

.cta{
  background: linear-gradient(180deg, rgba(79,70,229,0.10), rgba(31,120,180,0.08));
  border: 1px solid rgba(31,120,180,0.18);
  border-radius: 18px;
  padding: 18px;
  text-align:center;
}

.cta h3{
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 900;
}

.cta p{
  margin: 0 auto 14px;
  max-width: 720px;
  color: #3f3f3f;
  line-height: 1.7;
}

.ctaActions{
  display:flex;
  gap: 10px;
  justify-content:center;
  flex-wrap: wrap;
}

.ctaBtn{
  padding: 12px 18px;
  border-radius: 999px;
  border: none;
  background: #1f78b4;
  color: #fff;
  font-weight: 900;
  cursor: pointer;
}

.ctaBtn.ghost{
  background: transparent;
  color: #1f78b4;
  border: 2px solid #1f78b4;
}


.footer{
  width:100%;
  background:#0f2d46;
  color:#fff;
  margin-top:0;
}

.footer-inner{
  max-width:1200px;
  margin:0 auto;
  padding:18px 20px;
  display:flex;
  justify-content:space-between;
}
</style>