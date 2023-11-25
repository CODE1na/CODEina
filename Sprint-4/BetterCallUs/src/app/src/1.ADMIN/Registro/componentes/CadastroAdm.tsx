import {useEffect, useState} from 'react';
import ADM from '../../../types/ADM';
import axios from 'axios';
import { response } from 'express';
import "../styles/registro.css"

export const CadastroAdm = () =>{
    const [contas, setContas] = useState<Array<ADM>>([])
    const [nome, setNome] = useState('');
    const [cpf, setCPF] = useState('');
    const [senha, setSenha] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [cpfError, setCPFError] = useState('');
    const [campoError, setCampoError] = useState('');
    const [nomeError, setNomeError] = useState('');
    /* UseEffect get do Cliente*/
    useEffect(() =>{
        axios.get('http://localhost:3001/registroAdm')
            .then((response) =>{
                setContas(response.data);
            })
            .catch((error) =>{
                console.log(error)
            })
    }, [])

    const registrarConta = () =>{
        const privilegio = 2
        setNomeError('');
        setCPFError('');
        const padraoNome:RegExp = /^[A-Za-z\s]+$/;
        const padraoCpf:RegExp = /^\d+$/
        const padraoEmail:RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        
        if (nome !== '' && padraoNome.test(nome) && nome.trim() !== '' && cpf !== '' && padraoCpf.test(cpf) && cpf.length == 11 && departamento !== '' && senha !== '' && padraoEmail.test(email) &&privilegio === 2){
            axios.post('http://localhost:3001/registroAdm', {nome, cpf, senha, privilegio, email, departamento})
                .then(() =>{
                    setNome('');
                    setCPF('');
                    setEmail('');
                    setSenha('');
                    setDepartamento('');
                    let ContaAdm = new ADM(nome, cpf, senha, privilegio, email, departamento)
                    contas.push(ContaAdm)
            })
            .catch((error) =>{
                if(error.response && error.response.data && error.response.data.error === 'CPF já cadastrado'){
                    setCPFError('CPF já cadastrado, tente um CPF diferente!')
                }else{
                    console.error(error)
                }
            })
        }
        else{
            if(nome === '' || !nome.match(padraoNome) || nome.trim() == '' ){
                setNomeError('Coloque um nome com apenas letras e espaços.');
            }
  
            if (cpf === '' || padraoCpf.test(cpf) === false || cpf.length !== 11){
                  setCPFError('CPF invalido, insira um CPF válido.');
            }
  
              
            if (nome === '' || senha === '' || cpf === '' || departamento === ''){
                  setCampoError('Todos os campos devem ser preenchidos.')
            }
            if (email === '' || padraoEmail.test(email) == false){
                setEmailError('forma do email incorreta, tente novamente.');
            }
        }
    }
    return(
        <div className='bodyCad'>
        <h2>Registro de conta administrador</h2>
        <div>
            <label>Nome: </label><br />
            <input className='inputCadUser' type='text' placeholder='Nome completo.' value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div>
            <label>Email: </label><br />
            <input className='inputCadUser' type='email' value={email} placeholder='exemplo@gmail.com' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
            <label>CPF: </label><br />
            <input className='inputCadUser' type='text' maxLength={11} placeholder='Apenas números.' value={cpf} onChange={(e) => setCPF(e.target.value)} />
        </div>
        <div>
            <label>Senha: </label><br />
            <input className='inputCadUser' type='password' value={senha} placeholder='Senha forte de preferência.' onChange={(e) => setSenha(e.target.value)} />
        </div>
        <div>
            <label>Departamento: </label><br />
            <input className='inputCadUser' type='text' value={departamento} placeholder='Departamento atribuído.' onChange={(e) => setDepartamento(e.target.value)} />
        </div>
        <br />
        <button className='buttonCadUser' type='button' onClick={registrarConta}>Registrar</button>
            {campoError && <div style={{color: 'red'}}>{campoError}</div>}
            {nomeError && <div style={{color: 'red'}}>{nomeError}</div>}
            {cpfError && <div style={{color: 'red'}}>{cpfError}</div>}
            {emailError && <div style={{color: 'red'}}>{emailError}</div>}

        <div>
            <h2>Lista de administradores</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>cpf</th>
                        <th>email</th>
                        <th>Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {contas.map((adm)=>(
                            <tr key={adm.cpf}>
                                <td>{adm.nome}</td>
                                <td>{adm.cpf}</td>
                                <td>{adm.email}</td>
                                <td>{adm.departamento}</td>
                            </tr>
                        ))}
                </tbody>
                </table>
        </div>

        </div>
    )
}