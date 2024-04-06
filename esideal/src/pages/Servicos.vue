<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const servicos = ref([]);
const service_definitions = ref([]);
const router = useRouter();

// serviços que não foram realizados ou cancelados ordenados por data limite
axios.get('http://localhost:3000/services')
    .then(response => {
        let filteredServicos = response.data.filter(servico => servico.estado !== 'realizado' && servico.estado !== 'cancelado');

        filteredServicos.sort((a, b) => {
            if (!a.data || !b.data) {
                return a.data ? -1 : (b.data ? 1 : 0);
            }

            const dateA = new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos);
            const dateB = new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos);
            return dateA - dateB;
        });

        servicos.value = filteredServicos;
    })
    .catch(error => {
        console.error('Error fetching services data:', error);
    });

// definições de serviços
axios.get('http://localhost:3000/service-definitions')
    .then(response => {
        service_definitions.value = response.data;
    })
    .catch(error => {
        console.error('Error fetching definitions data:', error);
    });

const format_date = (date) => {
    if (date) {
        const { dia, mes, ano, hora, minutos } = date;
        if (dia !== undefined && mes !== undefined && ano !== undefined && hora !== undefined && minutos !== undefined) {
            return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
        }
    }
    return '-';
};

const format_service_definition = (def_id) => {
    const def = service_definitions.value.find(def => def.id === def_id);
    if (def) return def.descr;
    else return '-';
};

const format_service_state = (state) => {
    if (state === 'nafila') return 'Na fila';
    if (state === 'programado') return 'Programado';
    if (state === 'parado') return 'Parado';
};

const service_details = (id) => {
    router.push({ name: 'Pag_Servico', params: { id } });
};
</script>

<template>
    <h2 class="servicos-title">Serviços Atribuidos</h2>

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
                <tr class="servicos-table-row" v-for="servico in servicos" :key="servico.id" @click="service_details(servico.id)">
                    <td>{{ servico.id }}</td>
                    <td>{{ servico.vehicleId }}</td>
                    <td>{{ format_service_definition(servico['service-definitionId']) }}</td>
                    <td>{{ format_date(servico.data) }}</td>
                    <td>{{ format_service_state(servico.estado) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'Servicos'
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