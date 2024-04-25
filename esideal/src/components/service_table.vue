<script setup>
import { ref, defineProps, watchEffect } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useLoginStore } from '../stores/loginStore';

const loginStore = useLoginStore();

const props = defineProps(['possibleStates']);

const servicos = ref([]);
const serviceDefinitions = ref([]);
const router = useRouter();

const filteredServicos = ref([]);

const logged_mechanic = ref(loginStore.user_id);

axios.get(`http://localhost:3000/services?mecanico=${logged_mechanic.value}`)
    .then(response => {
        console.log("Response Data:", response.data);
        servicos.value = response.data.sort((a, b) => {
            if (a.data === undefined || b.data === undefined) return 0;
            const dateA = new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos);
            const dateB = new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
            return dateA - dateB;
        });
        console.log("Servicos:", servicos.value);
    })
    .catch(error => {
        console.error('Error fetching services data:', error);
    });

axios.get('http://localhost:3000/service-definitions')
    .then(response => {
        serviceDefinitions.value = response.data;
    })
    .catch(error => {
        console.error('Error fetching definitions data:', error);
    });

const formatDate = (date) => {
    if (date) {
        const { dia, mes, ano, hora, minutos } = date;
        if (dia !== undefined && mes !== undefined && ano !== undefined && hora !== undefined && minutos !== undefined) {
            return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
        }
    }
    return '-';
};

const formatServiceDefinition = (defId) => {
    const def = serviceDefinitions.value.find(def => def.id === defId);
    if (def) return def.descr;
    else return '-';
};

const serviceDetails = (id) => {
    router.push({ name: 'Página de serviço', params: { id } });
};

const formatServiceState = (state) => {
    if (state === 'recomendado') return 'Recomendado';
    if (state === 'porRealizar') return 'Por realizar';
    if (state === 'nafila') return 'Na fila';
    if (state === 'programado') return 'Programado';
    if (state === 'parado') return 'Parado';
    if (state === 'realizado') return 'Realizado';
    if (state === 'cancelado') return 'Cancelado';
};

watchEffect(() => {
    filteredServicos.value = servicos.value.filter(servico => props.possibleStates.includes(servico.estado));
});

</script>

<template>
    <div class="servicos-container">
      <table class="servicos-table">
        <thead>
          <tr>
            <th style="border-radius: 15px 0 0 0;">ID</th>
            <th>Matricula</th>
            <th>Servico</th>
            <th>Data limite</th>
            <th style="border-radius: 0 15px 0 0;">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr class="servicos-table-row" v-for="servico in filteredServicos" :key="servico.id" @click="serviceDetails(servico.id)">
            <td>{{ servico.id }}</td>
            <td>{{ servico.vehicleId }}</td>
            <td>{{ formatServiceDefinition(servico['service-definitionId']) }}</td>
            <td>{{ formatDate(servico.data) }}</td>
            <td>{{ formatServiceState(servico.estado) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>
  
  <style scoped>
    .servicos-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .servicos-table {
        width: 90%;
        height: 80%;
        border-radius: 20px;
        background-color: #D9D9D9;
        padding: 5px 5px;
    }

    .servicos-table th {
        background-color: white;
        padding: 10px 15px;
    }

    .servicos-table td {
        background-color: white;
        text-align: center;
    }

    .servicos-table-row:hover td {
        cursor: pointer;
        background-color: #cacaca25;
    }

    .servicos-table-row:last-child td:first-child {
        border-radius: 0 0 0 15px; 
    }

    .servicos-table-row:last-child td:last-child {
        border-radius: 0 0 15px 0; 
    }
  </style>
