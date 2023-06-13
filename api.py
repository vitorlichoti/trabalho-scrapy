import uvicorn
import json
from main import SpiderStatusInvest
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/status/{cod_acao}")
async def get_acao_status(cod_acao) -> str:
    try:
        status = SpiderStatusInvest()
        result = status.response_acao_data(cod_acao)
        return json.dumps(result)
    except AttributeError:
        raise HTTPException(status_code=404, detail="Acao nao encontrada")


if __name__ == "__main__":
    uvicorn.run(app, port=8000)
