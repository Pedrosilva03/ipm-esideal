<template>
    <h2 class="servicos-title">Histórico de serviços</h2>
    
    <ServiceTable :possibleStates="['realizado', 'cancelado']" />
</template>

<script>
import ServiceTable from '../components/service_table.vue';

export default {
    name: 'Servicos',

    components: {
        ServiceTable
    }
};
</script>

<style scoped>
    .servicos-title {
        width: fit-content;
        color: white;
        background-color: #FF0000;
        padding: 10px 15px;
        border-radius: 20px;
        margin-left: 5%;
        margin-bottom: 0;
    }
</style>