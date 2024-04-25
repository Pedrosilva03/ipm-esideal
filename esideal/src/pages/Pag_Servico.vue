<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { useLoginStore } from '../stores/loginStore';

const loginStore = useLoginStore();

const route = useRoute()
const id = route.params.id;

const editing = ref(false);
const confirm_finish = ref(false);
const cancel_service = ref(false);

const servico = ref(null);
const def_servico = ref(null);
const veiculo = ref(null);
const cliente = ref(null);
const vehicle_type = ref(null);
const service_definitions = ref([]);

const service_states = ref(['recomendado', 'porRealizar', 'nafila', 'programado', 'parado', 'realizado', 'cancelado', 'iniciado', 'atrasado']);

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

                        axios.get(`http://localhost:3000/vehicle-types/${veiculo.value['vehicle-typeId']}`)
                            .then(response => {
                              vehicle_type.value = response.data;
                            })
                            .catch(error => {
                              console.error('Error fetching vehicle services:', error);
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
        const formattedHora = hora.toString().padStart(2, '0');
        const formattedMinutos = minutos.toString().padStart(2, '0');
        return `${dia}/${mes}/${ano} ${formattedHora}:${formattedMinutos}`;
        
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
    if (state === 'recomendado') return 'Recomendado';
    if (state === 'iniciado') return 'Iniciado';
    if (state === 'atrasado') return 'Atrasado';
    else return '-';
};

const service_state_options = (current_state) => {
    return service_states.value.filter(state => state !== current_state && state !== 'programado' && state !== 'atrasado');
};

const toggle_editing = () => {
    editing.value = !editing.value;
};

const update_state = (selected_state) => {
    servico.value.estado = selected_state;

    if (selected_state == 'programado') {
      servico.value.agendamento = 'programado';
    }

    if (selected_state == 'naFila' || selected_state == 'porRealizar' || selected_state == 'parado' || selected_state == 'recomendado') {
      servico.value.agendamento = 'filaDeEspera';
    }

    if (selected_state == 'realizado') {
      confirm_finish.value = true;
    }

    if (selected_state == 'cancelado') {
      cancel_service.value = true;
    }

    if (selected_state != 'cancelado' && selected_state != 'realizado') {
      axios.put(`http://localhost:3000/services/${id}`, servico.value)
          .then(response => {
              console.log('Service state updated:', response);
              window.location.reload();
          })
          .catch(error => {
              console.error('Error updating service state:', error);
          });
    }
};

const confirm_service_finish = () => {
  const recomendations = document.querySelectorAll('.service-recomendation input:checked');

  recomendations.forEach(recomendation => {
    const recomendation_id = recomendation.value;

    axios.post('http://localhost:3000/services', {
        'id': 's' + Math.floor(Math.random() * 1000000),
        'service-definitionId': recomendation_id,
        'vehicleId': servico.value.vehicleId,
        'estado': 'recomendado',
        'agendamento': 'filaDeEspera',
        'descricao': 'Recomendação de serviço para o veículo',
        'mecanico': loginStore.user_id
    })
        .then(response => {
            console.log('Service recommendation added:', response);
        })
        .catch(error => {
            console.error('Error adding service recommendation:', error);
        });
  });

  servico.value.estado = 'realizado';

  axios.put(`http://localhost:3000/services/${id}`, servico.value)
      .then(response => {
          console.log('Service finished:', response);
          window.location.href = '/servicos';
      })
      .catch(error => {
          console.error('Error finishing service:', error);
      });
};

const cancel_service_finish = () => {
  confirm_finish.value = false;
  window.location.reload();
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
};

const confirm_service_cancel = () => {
  servico.value.estado = 'cancelado';

  axios.put(`http://localhost:3000/services/${id}`, servico.value)
      .then(response => {
          console.log('Service canceled:', response);
          window.location.href = '/servicos';
      })
      .catch(error => {
          console.error('Error canceling service:', error);
      });
};

const cancel_service_cancel = () => {
  cancel_service.value = false;
  window.location.reload();
};

const format_service_definition = (def_id) => {
    const def = service_definitions.value.find(def => def.id === def_id);
    if (def) return def.descr;
    else return '-';
};
</script>

<template>
    <h2 class="servico-title">Serviço {{ servico.id }}</h2>

    <div class="servico-container" v-if="!confirm_finish && !cancel_service">
      <div class="vehicle-info-container">
        <div class="vehicle-info-title">
          <img src="/imgs/sports-car.png" class="vehicle-icon">
          <h3>Veículo</h3>
        </div>

        <p class="vehile-info"><b>Matricula:</b> {{ veiculo.id }}</p>
        <p class="vehicle-info"><b>Tipo:</b> {{ veiculo['vehicle-typeId'] }}</p>
        <p class="vehicle-info" v-if="veiculo.cilindrada"><b>Cilindrada:</b> {{ veiculo.cilindrada }} cc</p>
        <p class="vehicle-info" v-if="veiculo.potencia"><b>Potência:</b> {{ veiculo.potencia }} W</p>
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

    <div class="confirm-service-end-container" v-if="confirm_finish">
      <img src="/imgs/close.png" class="cancel-service-finish close-icon" @click="cancel_service_finish()">
      <div class="confirm-service-title-container">  
        <h2 class="confirm-service-title">Serviço terminado</h2>
        <h3>Recomendar algum serviço ao cliente ?</h3>
      </div>

      <div class="service-recomendations-container">
        <div class="service-recomendation" v-for="service in vehicle_type['serviços']" :key="servico">
          <input type="checkbox" :value="service" :id="service" :name="service">{{ format_service_definition(service) }}
        </div>
      </div>

      <div class="service-info-edit-confirm-container" style="margin-top: 5px;" @click="confirm_service_finish()">
        <div class="service-info-edit-confirm-button">
          <h3>Confirmar</h3>
          <img class="edit-check-icon" src="/imgs/check.png">
        </div>
      </div>
    </div>

    <div class="confirm-cancel-service-container" v-if="cancel_service">
      <img src="/imgs/close.png" class="cancel-service-finish close-icon" @click="cancel_service_cancel()">
      <div class="confirm-service-title-container">  
        <h2 class="confirm-service-title">Cancelar serviço</h2>
        <h3>Pretende marcar o serviço como cancelado no sistema ?</h3>
      </div>

      <div class="service-info-edit-confirm-container" style="margin-top: 5px;" @click="confirm_service_cancel()">
        <div class="service-info-edit-confirm-button">
          <h3>Confirmar</h3>
          <img class="edit-check-icon" src="/imgs/check.png">
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
    margin-top: 2%;
  }

  .service-info-edit-confirm-button:hover {
    transform: scale(1.05);
  }

  .confirm-service-end-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 90%;
    margin: 0 auto;
    background-color: #D9D9D9; 
    padding: 10px 15px;
    border-radius: 20px;
  }

  .cancel-service-finish {
    cursor: pointer;
    transition: all .1s ease-in-out;
    margin-left: 95%;
  }

  .cancel-service-finish:hover {
    transform: scale(1.05);
  }

  .confirm-service-title {
    margin: 0 auto;
  }

  .service-recomendations-container {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;
    gap: 5%;
    width: 80%;
  }

  .service-recomendation {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5%;
    width: 30%;
  }

  .confirm-cancel-service-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 90%;
    margin: 0 auto;
    background-color: #D9D9D9; 
    padding: 10px 15px;
    border-radius: 20px;
  }
</style>