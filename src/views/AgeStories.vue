<template>
  <main class="page">
    <div class="container">
      <h1 class="title">
        Приказни за деца {{ ageLabel }}
      </h1>

      <div class="actions">
        <RouterLink class="back" to="/">← Назад на почетна</RouterLink>
      </div>

      <div class="grid">
        <article v-for="s in filtered" :key="s.id" class="card">
          <h3>{{ s.title }}</h3>
          <p>{{ s.preview }}</p>

          <RouterLink class="read" :to="`/prikazna/${s.id}`">Читај</RouterLink>
        </article>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { stories } from '../data/stories'

const route = useRoute()
const age = computed(() => route.params.age)

const filtered = computed(() => stories.filter(s => s.age === age.value))

const ageLabel = computed(() => (age.value === '3-5' ? '3–5 години' : '5–8 години'))
</script>

<style scoped>
.page { padding: 40px 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

.title { margin: 0 0 14px; font-size: 34px; font-weight: 900; }
.actions { margin-bottom: 18px; }

.back { text-decoration: none; font-weight: 800; color: #1f78b4; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.card {
  border: 1px solid #e6e6ee;
  border-radius: 18px;
  padding: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.read {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid #4f46e5;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 900;
}
.read:hover { background: #4f46e5; color: #fff; }
</style>
