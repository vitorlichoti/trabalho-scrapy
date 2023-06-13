import React, { useState } from 'react'
import axios from 'axios'
import './App.css'
import green from './assets/green.png'
import red from './assets/red.png'
import yellow from './assets/yellow.png'
import orange from './assets/orange.png'
import logo from './assets/logo.png'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material'

type dataType = {
  valor_atual: number;
  min: number;
  max: number;
  dividendo: string;
  valorizacao: string;
  pl: number;
  vp: number;
  vpa: number;
}

function App() {
  const [data, setData] = useState<dataType>()
  const [acao, setAcao] = useState<string>("")
  const [notFound, setNotFound] = useState(false)

  async function fetchData(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault()
    try {
      const res = await axios.get(`http://localhost:8000/status/${acao}`);
      const values = JSON.parse(res.data)
      setData(values)
      setNotFound(false)
    } catch (error: any) {
      if (error.request.status === 404) {
        setNotFound(true)
      }
    }
  }

  function staticsResults() {
    if (data) {
      if (data.pl > 2 && data.vp < 1 && data.vpa > data.valor_atual) {        
        return (
          <div className='arrow-text-container'>
            <div className='arrows-container'>
              <img src={green} />
            </div>
            <p>Pela análise do VPA, atualmente as ações desse ativo estão sendo negociadas abaixo do valor do seu patrimônio, possibilidade de alta, mas é necessário consultar o histórico de endividamento</p>
            <p>O P/L demonstra que existe bons multiplos de lucros, existe otimismo do mercado para esse ativo.</p>
            <p>O P/VP está abaixo de 1, isso indica possivel oportunidade de compra</p>
            <p>Com base nessas informações, possivelmente está barata a ação, com possíveis crescimentos no seu preço.</p>
          </div>
        )
      } else if (data.pl < 2 && data.vp < 1 && data.vpa > data.valor_atual) {
        return (
          <div className='arrow-text-container'>
            <div className='arrows-container'>
              <img src={orange} />
            </div>
            <p>Pela análise do VPA, atualmente as ações desse ativo estão sendo negociadas abaixo do valor do seu patrimônio, possibilidade de alta, mas é necessário consultar o histórico de endividamento</p>
            <p>O P/L demonstra que não existe bons multiplos de lucros, para esse ativo o mercado não está otimista.</p>
            <p>O P/VP está abaixo de 1, isso indica possivel oportunidade de compra</p>
            <p>Com base nessas informações, possivelmente está barata a ação, com possíveis crescimentos no seu preço, porém o mercado está pessimista com relação a este ativo, possível risco de baixo retorno ou prejuízo.</p>
          </div>
        )
      } else if (data.pl > 2 && data.vp > 1 && data.vpa < data.valor_atual) {
        return (
          <div className='arrow-text-container'>
            <div className='arrows-container'>
              <img src={yellow} />
            </div>
            <p>Pela análise do VPA, as ações desse ativo estão sendo negociadas acima do valor do seu patrimônio, significa que ela está valorizada no mercado. (ao mesmo tempo que esse ativo pode passar por quedas)</p>
            <p>O P/L demonstra que existe bons multiplos de lucros, para esse ativo o mercado está otimista.</p>
            <p>O P/VP está acima de 1, isso indica que a ação está caro.</p>
            <p>Com base nessas informações, possivelmente está caro a ação, talvez não seja a melhor hora para comprá-la, mas é possivelmente um bom ativo.</p>
          </div>
        )
      } else {
        return (
          <div className='arrow-text-container'>
            <div className='arrows-container'>
              <img src={red} />
            </div>
            <p>Pela análise do VPA, as ações desse ativo estão sendo negociadas acima do valor do seu patrimônio, significa que ela está valorizada no mercado. (ao mesmo tempo que esse ativo pode passar por quedas)</p>
            <p>O P/L demonstra que não existe bons multiplos de lucros, para esse ativo o mercado está pessimista.</p>
            <p>O P/VP está acima de 1, isso é um indicador que a ação está possivelmente cara.</p>
            <p>Com base nessas informações, não compre este ativo, a menos que faça uma análise minunciosa de mercado</p>
          </div>
        )
      }
    }
  }

  return (
    <div className='main-container'>
      <div className="form-results-container">
        <form className='form-container' onSubmit={(e) => fetchData(e)}>
          <img src={logo} style={{ "marginBottom": "20px"}}/>
          <div>
            <TextField id="standard-basic" label="Digite o código da ação" variant="standard" onChange={({target}) => setAcao(target.value)} />
            {notFound && <Alert severity="error" style={{"width": "60%"}}>Código da ação inválida, confira a lista clicando <a href='https://www.dadosdemercado.com.br/bolsa/acoes'>aqui</a></Alert>}
          </div>
          <Button type='submit' variant="outlined" className='submit-button'>Obter Relatório</Button>
        </form>
        {data && <>
          <div className='results-container'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" className='table-current-status'>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "16px" }}>Valor Atual</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "16px" }}>Mínimo (12 Meses)</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "16px" }}>Máximo (12M Meses)</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "16px" }}>Dividendo</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "16px" }}>Valorização</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "14px" }}>R$ {data?.valor_atual}</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "14px" }}>R$ {data?.min}</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "14px" }}>R$ {data?.max}</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "14px" }}>{data?.dividendo}%</TableCell>
                  <TableCell align="center" style={{ "fontWeight": "bolder", "fontSize": "14px" }}>{data?.valorizacao}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className="fundamentalists-indicators">
            <h2 className='title-fundamentalists'>Alguns Insigths Fundamentalistas</h2>
            <div className='indicators-container'>
              <hr />
              <div className="indicator-cards-container">
                  <p className="pl-text-card">
                    {data && staticsResults()}
                  </p>
              </div>
            </div>
          </div>
        </div>
        </>}
      </div>
    </div>
  )
}

export default App
