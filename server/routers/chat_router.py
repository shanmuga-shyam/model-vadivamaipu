from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ml_engine.rag_engine import process_chat_message

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_text()
            response = await process_chat_message(message)
            await websocket.send_text(response)
    except WebSocketDisconnect:
        await websocket.close()