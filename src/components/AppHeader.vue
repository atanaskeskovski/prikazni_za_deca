<template>
  <header class="header">
    <div class="container">
      <RouterLink class="brand" to="/">Бесплатни детски приказни</RouterLink>

      <nav class="nav">
        <RouterLink class="navLink" to="/">Почетна</RouterLink>
        <RouterLink class="navLink" to="/#stories">Сите приказни</RouterLink>
        <RouterLink class="navLink" to="/vozrast/3-5">Возраст 3-5</RouterLink>
        <RouterLink class="navLink" to="/vozrast/5-8">Возраст 5-8</RouterLink>
        <RouterLink class="navLink" to="/za-nas">За нас</RouterLink>
        <RouterLink class="navLink contact" to="/za-nas#kontakt">Контакт</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.header{
  position: sticky;
  top: 0;
  z-index: 50;
  background: #1f78b4;
  color:#fff;
}

/* тенка сенка под header */
.header::after{
  content:"";
  display:block;
  height:1px;
  background: rgba(255,255,255,.18);
}

.container{
  max-width:1200px;
  margin:0 auto;
  padding:12px 18px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
}

/* ✅ БРЕНД: “стар” feeling (serif) */
.brand{
  color:#fff;
  text-decoration:none;
  font-weight:900;
  letter-spacing:.2px;
  white-space:nowrap;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
}

/* NAV */
.nav{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:center;

  /* “glass rail” зад линковите */
  padding:6px;
  border-radius:999px;
  background: rgba(255,255,255,.10);
  backdrop-filter: blur(8px);
}

/* ✅ ЛИНКОВИ: како “tabs” */
.navLink{
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:10px 14px;
  border-radius:999px;
  text-decoration:none;
  color:#fff;
  font-weight:800;
  line-height:1;
  letter-spacing:.1px;

  /* поелегантно од рамка */
  background: transparent;
  opacity:.95;
  transition: background .15s ease, transform .15s ease, opacity .15s ease;
}

/* hover */
.navLink:hover{
  background: rgba(255,255,255,.14);
  transform: translateY(-1px);
  opacity: 1;
}

/* ✅ active underline + “tab” feel */
.navLink.router-link-active{
  background: rgba(255,255,255,.18);
  opacity: 1;
}

/* underline indicator */
.navLink.router-link-active::after{
  content:"";
  position:absolute;
  left:14px;
  right:14px;
  bottom:6px;
  height:3px;
  border-radius:999px;
  background:#ffffff;
  opacity:.95;
}

/* Контакт нека е малку поистакнат */
.navLink.contact{
  background: rgba(255,255,255,.16);
}
.navLink.contact:hover{
  background: rgba(255,255,255,.22);
}

/* Responsive */
@media (max-width: 760px){
  .container{
    flex-direction:column;
    align-items:flex-start;
    gap:10px;
  }
  .nav{
    width:100%;
    justify-content:flex-start;
  }
  .navLink{
    padding:9px 12px;
    font-size:14px;
  }
}
</style>