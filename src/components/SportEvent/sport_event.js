import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {Input, Label, Container, Modal, ModalBody,ModalHeader,FormGroup,ModalFooter} from 'reactstrap'
import Medal_by_event from '../medal_by_event/medal_by_event';
import { BrowserRouter as Router,Route,Link,Switch } from 'react-router-dom';


const url = 'https://universidaddecaldas.apps.dreamfactory.com/api/v2/mysql/_table/sport_event'
const headers = {
  'Content-Type': 'application/json',
  'x-dreamfactory-api-key': '5ad51294309eec6cbfa132c695e08c5460f8f44bdb961342a62586617972f3e6'
}


class Sport_Event extends Component {

    
  state={
    idevento: '',
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{ 
      id:'' ,
      name: '',
      type_event: '',
      tipoModal: ''    
    },
    edit :{
      id:'',
      name:'',
      type_event: '',
    }
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  peticionGet=()=>{
  axios.get(url, { headers}).then(response=>{
    this.setState({data: response.data.resource});
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
    axios.delete(url+"/"+ this.state.edit.id,{ headers }).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  seleccionarPais=(evento)=>{
    this.setState({
      tipoModal: 'actualizar',
      edit: 
        {
          id: evento.id,
          name: evento.name,
          type_event: evento.type_event
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
    }
    handleClick(idevento){
      this.setState({
        idevento:idevento
      });

    }

  componentDidMount() {
    this.peticionGet();
  }

  
  render(){
    const {form}=this.state;
    const {edit}=this.state;
    const {idevento}=this.state;

  return (
    <div className="App">
        <Router>  
    <br />
    <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Evento</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Tipo de Evento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
      {this.state.data.map(evento=>{
          return(
            <tr>
          <td>{evento.id}</td>
          <td>{evento.name}</td>
          <td>{evento.type_event}</td>
          <td>
           
                <Link to="/Medal_by_event"><button className="btn btn-success"  onClick={()=>{this.handleClick(evento.id)}}  >Premiar</button></Link>
               
          
            {"   "}
                <button className="btn btn-primary" onClick={()=>{this.seleccionarPais(evento); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarPais(evento); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
       
               
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
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?(form.id, edit.id) : this.state.data.length+2}/>
                    <br />
                    <label htmlFor="name">Nombre</label>
                    <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={ form?(form.name,edit.name) : ''}/>
                    <br />
                    <Label for="type_event">Tipo de Evento</Label>
                        <Input type="select" name="type_event" id="type_event" onChange={this.handleChange}> 
                        <option>Seleccione tipo de Evento</option>   
                        <option>single</option>   
                        <option>group</option>    
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
               Estás seguro que deseas eliminar el evento {edit.name}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
          <Switch>    
          <Medal_by_event idevento={idevento}/>          
                    <Route exact path='/Medal_by_event' component={Medal_by_event}></Route>
                  
                </Switch>
          </Router>
        
    </div>
  );
}

}


export default Sport_Event;
