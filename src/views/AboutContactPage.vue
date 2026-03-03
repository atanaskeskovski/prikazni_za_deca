<template>
  <main class="page">
    <div class="wrap">

      <h1 class="pageTitle">За нас</h1>


      <section class="card">
        <h2 class="cardTitle">За нас</h2>

        <p>
          Оваа веб-страница е создадена со цел да им обезбеди на децата бесплатни,
          оригинални и внимателно напишани приказни на македонски јазик.
        </p>

        <p>
          Приказните се поделени според возраст, со што им помагаат на родителите и
          воспитувачите полесно да изберат содржина која е соодветна за развојот,
          вниманието и разбирањето на децата.
        </p>

        <p>
          Нашата цел е преку приказните да се поттикне љубовта кон читањето, да се
          развие фантазијата и да се пренесат важни вредности како добрина,
          пријателство, храброст, почит и грижа за другите.
        </p>

        <p>
          Сите приказни се пишувани со едноставен и јасен јазик, прилагоден за
          најмладите, а воедно и доволно интересен за да го задржи нивното внимание.
        </p>

        <p>
          Веруваме дека читањето од мали нозе создава основа за подобро учење,
          креативно размислување и емоционален развој. Исто така приказните се
          достапни и со аудио снимки.
        </p>
      </section>

      <!-- CONTACT CARD -->
      <section class="card">
        <h2 class="cardTitle">Контакт</h2>

        <p class="muted">
          Доколку имате прашања, предлози, идеи за нови приказни или сакате да придонесете
          со сопствена приказна — пишете ни.
        </p>

        <!-- FORM -->
        <form class="form" @submit.prevent="sendMail">
          <div class="row">
            <label class="lbl">
              Име и презиме
              <input v-model.trim="form.name" type="text" placeholder="Пр. Атанас" required />
            </label>

            <label class="lbl">
              Е-пошта
              <input v-model.trim="form.email" type="email" placeholder="пример@mail.com" required />
            </label>
          </div>

          <label class="lbl">
            Наслов
            <input v-model.trim="form.subject" type="text" placeholder="Пр. Предлог за нова приказна" required />
          </label>

          <label class="lbl">
            Порака
            <textarea v-model.trim="form.message" rows="6" placeholder="Напиши ја пораката..." required />
          </label>

          <div class="actions">
            <button class="btn" type="submit">Испрати</button>

            <!-- MAILTO BACKUP -->
            <a class="btn outline" :href="mailtoHref" target="_blank" rel="noreferrer">
              Отвори во е-пошта (mailto)
            </a>
          </div>

          <p v-if="hint" class="hint">{{ hint }}</p>
        </form>

        <div class="backup">
          <div class="backupTitle">Backup контакт</div>
          <div class="backupRow">
            Контакт e-mail:
            <a class="mail" :href="`mailto:${TO_EMAIL}`">{{ TO_EMAIL }}</a>
          </div>
        </div>
      </section>

      <RouterLink class="home" to="/">🏠 Почетна</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue"

const TO_EMAIL = "atanas.keskovski@finki.ukim.mk"

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
})

const hint = ref("")

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(form.subject || "Контакт")
  const body = encodeURIComponent(
      `Име: ${form.name}\nЕ-пошта: ${form.email}\n\nПорака:\n${form.message}\n`
  )
  return `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`
})

function sendMail() {
  window.location.href = mailtoHref.value
  hint.value = "Ако не се отвори е-поштата автоматски, кликни „Отвори во е-пошта (mailto)“."
}
</script>

<style scoped>
.page { padding: 40px 18px; background: #f6f7fb; min-height: calc(100vh - 56px); }
.wrap { max-width: 980px; margin: 0 auto; }

.pageTitle { font-size: 38px; margin: 0 0 18px; }

.card {
  background: #fff;
  border: 1px solid #e8e8ee;
  border-radius: 18px;
  padding: 22px;
  margin: 16px 0;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
}

.cardTitle { font-size: 28px; margin: 0 0 10px; }
.muted { color: #444; line-height: 1.7; }

.form { margin-top: 14px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.lbl { display: grid; gap: 6px; font-weight: 800; font-size: 13px; color: #222; }
input, textarea {
  font: inherit;
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid #dfe3ea;
  outline: none;
  background: #fff;
}
input:focus, textarea:focus { border-color: #1f78b4; box-shadow: 0 0 0 3px rgba(31,120,180,.12); }

.actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }

.btn {
  border: none;
  background: #1f78b4;
  color: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn.outline {
  background: transparent;
  color: #1f78b4;
  border: 2px solid #1f78b4;
}

.hint { margin-top: 10px; color: #444; font-size: 13px; }

.backup {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed #e1e5ec;
}
.backupTitle { font-weight: 900; margin-bottom: 6px; }
.backupRow { color: #333; }
.mail { font-weight: 900; color: #1f78b4; text-decoration: none; }

.home { display: inline-block; margin-top: 14px; font-weight: 900; text-decoration: none; color: #1f78b4; }

@media (max-width: 720px) {
  .row { grid-template-columns: 1fr; }
}
</style>