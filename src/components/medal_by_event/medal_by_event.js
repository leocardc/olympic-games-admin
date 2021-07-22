import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {Label, Input, Container, Modal, ModalBody,ModalHeader,FormGroup,ModalFooter} from 'reactstrap'


const url = 'https://universidaddecaldas.apps.dreamfactory.com/api/v2/mysql/_table/medal_by_event'
const urlCountry = 'https://universidaddecaldas.apps.dreamfactory.com/api/v2/mysql/_table/Country'
const urlEventos = 'https://universidaddecaldas.apps.dreamfactory.com/api/v2/mysql/_table/sport_event'
const headers = {
  'Content-Type': 'application/json',
  'x-dreamfactory-api-key': '5ad51294309eec6cbfa132c695e08c5460f8f44bdb961342a62586617972f3e6'
}

export default class Medal_by_event extends Component {

  state={
        data:[],
        countries:[],
        eventos:[],
        modalInsertar: false,
        modalEliminar: false,
        form:{ 
          id:'' ,
          id_event:'',
          id_country:'',
          type_medal: '',
          tipoModal: ''    
        },
        edit :{
          id:'',
          id_event:'',
          id_country:'',
          type_medal: '',
        }
      }
    
      modalInsertar=()=>{
        this.setState({modalInsertar: !this.state.modalInsertar});
      }
    
      peticionGet=()=>{
      axios.get(url, { headers }).then(response=>{
        this.setState({data: response.data.resource});
        console.log(response.data.resource)
      }).catch(error=>{
        console.log(error.message);
      })
      }

      peticionGetCountry=()=>{
        axios.get(urlCountry, { headers }).then(response=>{
          this.setState({countries: response.data.resource});
          console.log(response.data.resource)
        }).catch(error=>{
          console.log(error.message);
        })
        }
        peticionGetEventos=()=>{
          axios.get(urlEventos, { headers}).then(response=>{
            this.setState({eventos: response.data.resource});
            console.log(response.data.resource)
          }).catch(error=>{
            console.log(error.message);
          })
          }
    
      peticionPost=async()=>{
    
        let resource = []
        
        resource.push(this.state.form)
        console.log(resource)
       await axios.post(url, resource, { headers}).then(response=>{
          this.modalInsertar();
          this.peticionGet();
        }).catch(error=>{
          console.log(error.message);
        })
      }
    
      peticionPut=()=>{
        const urlId = this.state.edit.id
        axios.put(url+"/"+ urlId, this.state.edit, { headers }).then(response=>{
          this.modalInsertar();
          this.peticionGet();
        })
      }
      
      peticionDelete=()=>{
        axios.delete(url+"/"+ this.state.edit.id,{ headers}).then(response=>{
          this.setState({modalEliminar: false});
          this.peticionGet();
        })
      }
    
      seleccionarEvento=(medal)=>{
        this.setState({
          tipoModal: 'actualizar',
          edit: 
            {
              id: medal.id,
              id_event: medal.id_event,
              id_country: medal.id_country
            }
          })
      }
      
    
      handleChange=async e=>{
        e.persist();
        await this.setState({
          form:{ 
            ...this.state.form,
            [e.target.name]: e.target.value
      
          },
          edit:{
            ...this.state.edit,
            [e.target.name]: e.target.value
      
          }
        });
       console.log(this.state.form);
       console.log(this.state.edit.id);
        }
    
      componentDidMount() {
        this.peticionGet();
        this.peticionGetEventos();
        this.peticionGetCountry();
      }
     
      
      render(){
        const {idevento} = this.props;
        const {form} = this.state
      return (
        <div className="App">
         
        <br />
        <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Premiación</button>
      <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID EVENTO</th>
              <th>ID PAIS</th>
              <th>PAIS</th>
              <th>EVENTO</th>
              <th>Tipo de Medalla</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {this.state.data.filter(medal=> medal.id_event===idevento).map(medal=>{
              return(
                <tr>
              <td>{medal.id}</td>
              <td>{medal.id_event}</td>
              <td>{medal.id_country}</td>
              <td>{medal.Country_by_id_country.name}</td>
              <td>{medal.sport_event_by_id_event.name}</td>
              <td>{medal.type_medal}</td>
              <td>
                    <button className="btn btn-primary" onClick={()=>{this.seleccionarEvento(medal); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={()=>{this.seleccionarEvento(medal); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                    </td>
              </tr>
              )
            })}
          </tbody>
        </table>
    
        <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    
                    <Label for="id_event">Tipo evento</Label>
                        <Input type="select" name="id_event" id="id_event" onChange={this.handleChange}>   
                        <option>Seleccione evento</option>   
                            {this.state.eventos.map(item =>                
                              <option value={item.id}> {item.name} </option>                              
                            )} 
                        </Input>
                        <br />
                        <Label for="id_country">Pais</Label>
                        <Input type="select" name="id_country" id="id_country" onChange={this.handleChange}> 
                        <option>Seleccione pais</option>   
                            {this.state.countries.map(item =>                
                              <option value={item.id}> {item.name} </option>                              
                            )} 
                        </Input>
                        <br />
                        <Label for="type_medal">Medalla</Label>
                        <Input type="select" name="type_medal" id="type_medal" onChange={this.handleChange}> 
                        <option>Seleccione medalla</option>   
                        <option>GOLD</option>   
                        <option>SILVER</option>   
                        <option>BRONZE</option>   
                            
                        </Input>
                  </div>
                </ModalBody>

                <ModalFooter>
                    {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>:<button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar la premiacion
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
}
