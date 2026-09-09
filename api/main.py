import json
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

app = FastAPI(title="HobbyBox Rental API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
kits = json.loads((Path(__file__).resolve().parent.parent / "data/kits.json").read_text())


class QuoteRequest(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    kit_id: str = Field(min_length=1, max_length=80)
    days: int = Field(ge=2, le=21)
    protection: bool
    delivery: Literal["pickup", "shipped"]


@app.get("/health")
def health():
    return {"status": "ok", "mode": "demo", "inventory": "fixture"}


@app.get("/kits")
def list_kits():
    return kits


@app.post("/rentals/quote")
def quote_rental(request: QuoteRequest):
    kit = next((item for item in kits if item["id"] == request.kit_id), None)
    if kit is None:
        raise HTTPException(status_code=404, detail="kit_not_found")
    if request.days > kit["availableDays"]:
        raise HTTPException(
            status_code=409,
            detail={"code": "inventory_window_unavailable", "availableDays": kit["availableDays"]},
        )

    rental = kit["dailyRate"] * request.days
    discount = round(rental * 0.15) if request.days >= 7 else 0
    net_rental = rental - discount
    protection = round(net_rental * 0.12) if request.protection else 0
    delivery = 24 if request.delivery == "shipped" else 0
    hold_rate = 0.10 if request.protection else 0.25
    refundable_hold = round(kit["replacementValue"] * hold_rate)

    return {
        "kitId": kit["id"],
        "days": request.days,
        "rental": rental,
        "discount": discount,
        "protection": protection,
        "delivery": delivery,
        "dueToday": net_rental + protection + delivery,
        "refundableHold": refundable_hold,
        "returnDay": request.days + 1,
        "disclaimer": "Illustrative fixture quote; no inventory, payment, protection policy, or reservation is live.",
    }
