<template>
    <div class="footer-container">
        <p class="footer-text">Esideal - 2024</p>
    </div>
</template>

<script>
  export default {
    name: 'Footer',
  }
</script>

<style scoped>
  .footer-container {
    display: flex;
    align-items: center;
    bottom: 0;
    background-color: #FF0000;
    color: white;
    padding: 1rem;
    margin-top: 5%;
    position: fixed;
    width: 100%;
  }

    .footer-text {
        margin: 0 auto;
    }
</style>