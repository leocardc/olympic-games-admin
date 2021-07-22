import React, { Component } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {Table, Button, Container, Modal, ModalBody,ModalHeader,FormGroup,ModalFooter} from 'reactstrap'

const url = 'https://universidaddecaldas.apps.dreamfactory.com/api/v2/mysql/_table/Country'

const headers = {
  'Content-Type': 'application/json',
  'x-dreamfactory-api-key': '5ad51294309eec6cbfa132c695e08c5460f8f44bdb961342a62586617972f3e6'
}


export default class Country extends Component {
 
    
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{ 
      id:'' ,
      name: '',
      tipoModal: ''    
    },
    edit :{
      id:'',
      name:''
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
   await axios.post(url, resource, {headers}).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPut=()=>{
    const urlId = this.state.edit.id
    axios.put(url+"/"+ urlId, this.state.edit, { headers}).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }
  
  peticionDelete=()=>{
    axios.delete(url+"/"+ this.state.edit.id,{headers}).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
  }

  seleccionarPais=(pais)=>{
    this.setState({
      tipoModal: 'actualizar',
      edit: 
        {
          id: pais.id,
          name: pais.name
        }
      })
  }
  

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{ 
        [e.target.id]:e.target.id,
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
  }
  
  render(){
    const {form}=this.state;
    const {edit}=this.state;
  return (
    <div className="App">
    <br />
    <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar País</button>

  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
      {this.state.data.map(pais=>{
          return(
            <tr>
          <td>{pais.id}</td>
          <td>{pais.name}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarPais(pais); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarPais(pais); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
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
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?(form.id,edit.id) : this.state.data.length+2}/>
                    <br />
                    <label htmlFor="name">Nombre</label>
                    <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={ form?(form.name,edit.name) : ''}/>
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
               Estás seguro que deseas eliminar el país {edit.name}
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