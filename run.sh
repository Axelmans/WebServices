#!/bin/bash
python3 run_app.py &
cd frontend || exit
npm start