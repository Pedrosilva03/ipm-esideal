<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id;

const editing = ref(false);

const servico = ref(null);
const def_servico = ref(null);
const veiculo = ref(null);
const cliente = ref(null);

const service_states = ref(['porRealizar', 'nafila', 'programado', 'parado', 'realizado', 'cancelado']);

// variaveis para guardar os valores dos campos editaveis
const data_edit = ref(null);
const observacoes_edit = ref(null);

axios.get(`http://localhost:3000/services/${id}`)
    .then(response => {
        servico.value = response.data;

        axios.get(`http://localhost:3000/service-definitions/${servico.value['service-definitionId']}`)
            .then(def_servico_response => {
                def_servico.value = def_servico_response.data;

                axios.get(`http://localhost:3000/vehicles/${servico.value.vehicleId}`)
                    .then(vehicleResponse => {
                        veiculo.value = vehicleResponse.data;

                        axios.get(`http://localhost:3000/clients/${veiculo.value.clientId}`)
                            .then(clientResponse => {
                                cliente.value = clientResponse.data;
                            })
                            .catch(clientError => {
                                console.error('Error fetching client data:', clientError);
                            });
                    })
                    .catch(vehicleError => {
                        console.error('Error fetching vehicle data:', vehicleError);
                    });
            })
            .catch(vehicleError => {
                console.error('Error fetching service definition data:', vehicleError);
            });
    })
    .catch(serviceError => {
        console.error('Error fetching service data:', serviceError);
    });

const format_date = (date) => {
  if (date) {
      const { dia, mes, ano, hora, minutos } = date;
      if (dia !== undefined && mes !== undefined && ano !== undefined && hora !== undefined && minutos !== undefined) {
          return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
      }
  }
  return 'Sem data de entrega';
};

const format_service_state = (state) => {
    if (state === 'porRealizar') return 'Por realizar';
    if (state === 'nafila') return 'Na fila';
    if (state === 'programado') return 'Programado';
    if (state === 'parado') return 'Parado';
    if (state === 'realizado') return 'Realizado';
    if (state === 'cancelado') return 'Cancelado';
};

const service_state_options = (current_state) => {
    return service_states.value.filter(state => state !== current_state && state !== 'programado');
};

const toggle_editing = () => {
    editing.value = !editing.value;
};

const update_state = (selected_state) => {
    servico.value.estado = selected_state;

    if (selected_state == 'programado') {
      servico.value.agendamento = 'programado';
    }

    if (selected_state == 'naFila' || selected_state == 'porRealizar') {
      servico.value.agendamento = 'filaDeEspera';
    }

    axios.put(`http://localhost:3000/services/${id}`, servico.value)
        .then(response => {
            console.log('Service state updated:', response);
        })
        .catch(error => {
            console.error('Error updating service state:', error);
        });

    if (selected_state == 'realizado' || selected_state == 'cancelado') {
      window.location.href = '/servicos';
    } 
    
    else {
      // refresh
      window.location.reload();
    }
};

const confirm_service_info_edit = () => {
  if (data_edit.value) {
    const [date, time] = data_edit.value.split('T');
    servico.value.data = {
      dia: Number(date.split('-')[2]),
      mes: Number(date.split('-')[1]),
      ano: Number(date.split('-')[0]),
      hora: Number(time.split(':')[0]),
      minutos: Number(time.split(':')[1])
    };

    // Adicionar uma data de entrega e a unica forma de passar para programado
    servico.value.estado = 'programado';
    servico.value.agendamento = 'programado'
  }

  if (observacoes_edit.value) servico.value['descrição'] = observacoes_edit.value;

    axios.put(`http://localhost:3000/services/${id}`, servico.value)
        .then(response => {
            console.log('Service info updated:', response);
        })
        .catch(error => {
            console.error('Error updating service info:', error);
        });

    // refresh
    window.location.reload();
}
</script>

<template>
    <h2 class="servico-title">Serviço {{ servico.id }}</h2>

    <div class="servico-container">
      <div class="vehicle-info-container">
        <div class="vehicle-info-title">
          <img src="/imgs/sports-car.png" class="vehicle-icon">
          <h3>Veículo</h3>
        </div>

        <p class="vehile-info"><b>Matricula:</b> {{ veiculo.id }}</p>
        <p class="vehicle-info"><b>Tipo:</b> {{ veiculo['vehicle-typeId'] }}</p>
        <p class="vehicle-info"><b>Cilindrada:</b> {{ veiculo.cilindrada }}</p>
        <p class="vehicle-info"><b>Quilometros:</b> {{ veiculo.kms }} kms</p>
        <p class="vehicle-info"><b>Cliente:</b> {{ cliente.nome }}</p>
        <p class="vehicle-info"><b>Contacto:</b> {{ cliente.telefone }}</p>
      </div>

      <div class="service-info-container">
        <div class="service-info-title-container">
          <div class="service-info-title">
            <img src="/imgs/wrench.png" class="service-icon">
            <h3>Serviço</h3>
          </div>

          <img src="/imgs/editing.png" class="edit-icon" v-if="!editing" @click="toggle_editing">
          <img src="/imgs/close.png" class="close-icon" v-if="editing" @click="toggle_editing">
        </div>
        
        <p class="service-info">
          <b>Descrição:</b>
          <span>{{ def_servico.descr }}</span> 
        </p>

        <p class="service-info">
          <b>Duração:</b>
          <span>{{ def_servico['duração'] }} min</span>
        </p>

        <p class="service-info">
          <b>Entrega:</b> 
          <span v-if="!editing">{{ format_date(servico.data) }}</span>
          <input class="service-info-edit" type="datetime-local" v-if="editing" v-model="data_edit">
        </p>

        <p class="service-info">
          <b>Observações:</b> 
          <span v-if="!editing">{{ servico['descrição'] }}</span>
          <input class="service-info-edit" type="text" v-if="editing" v-model="observacoes_edit" :placeholder="servico['descrição']">
        </p>

        <div class="service-state-select-container" v-if="!editing">
          <select class="service-state-select" @change="update_state($event.target.value)">
            <option value="" disabled selected>{{ format_service_state(servico.estado) }}</option>
            <option v-for="state in service_state_options(servico.estado)" :value="state">{{ format_service_state(state) }}</option>
          </select>
        </div>

        <div class="service-info-edit-confirm-container" v-if="editing">
          <div class="service-info-edit-confirm-button" @click="confirm_service_info_edit()">
            <h3>Confirmar</h3>
            <img class="edit-check-icon" src="/imgs/check.png">
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'Pag_Servico'
}
</script>

<style scoped>
  .servico-title {
    width: fit-content;
    color: white;
    background-color: #FF0000;
    padding: 10px 15px;
    border-radius: 20px;
    margin-left: 5%;
  }

  .servico-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 90%;
    gap: 5%;
    margin: 0 auto;
  }

  .vehicle-info-container, .service-info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    padding: 15px 15px;
    height: 100%;
    justify-content: left;
    align-items: baseline;
  }

  .vehicle-info-container {
    background-color: #FF0000;
    color: white;
    width: 40%;
  }

  .service-info-container {
    background-color: #D9D9D9;
    width: 60%;
  }

  .service-info-title-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .service-info-title, .vehicle-info-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    width: 80%;
    gap: 5%;
  }

  .vehicle-icon, .service-icon, .edit-icon, .edit-check-icon, .close-icon {
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all .1s ease-in-out;
  }

  .edit-icon:hover, .close-icon:hover {
    transform: scale(1.05);
  }

  .service-state-select-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .service-state-select {
    background-color: white;
    padding: 10px 50px;
    border-radius: 20px;
  }

  .service-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2%;
    width: 80%;
  }

  .service-info-edit {
    background-color: white;
    padding: 10px 15px;
    border-radius: 20px;
  }

  .service-info-edit-confirm-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .service-info-edit-confirm-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5%;
    padding: 10px 30px;
    border-radius: 20px;
    background-color: #FF0000;
    color: white;
    cursor: pointer;
    transition: all .1s ease-in-out;
  }

  .service-info-edit-confirm-button:hover {
    transform: scale(1.05);
  }
</style>