#!/bin/zsh

dotenv -e .env.local -- jest tests/tarrifIntegrations.test.ts 
dotenv -e .env.local -- jest tests/vendorIntegrations.test.ts         
dotenv -e .env.local -- jest tests/paymentsIntegrations.test.ts         
dotenv -e .env.local -- jest tests/productsIntegrations.test.ts         
dotenv -e .env.local -- jest tests/invoicesIntegrations.test.ts         
dotenv -e .env.local -- jest tests/shipmentsIntegrations.test.ts         
