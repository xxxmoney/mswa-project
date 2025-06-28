const request = require('supertest');
const app = require('../app');
const { v4: uuidv4 } = require('uuid');

describe('API Endpoints', () => {
  const testId = uuidv4();
  const testCurrencyIso = 'USD';
  const testCountryIso = 'US';

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('API Documentation', () => {
    it('should return API info', async () => {
      const res = await request(app).get('/api');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Reference Data API');
    });
  });

  describe('Authentication', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Currency Operations', () => {
    it('should create a currency', async () => {
      const res = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: testCurrencyIso,
          name: 'US Dollar'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isoCode).toBe(testCurrencyIso);
      expect(res.body.data.id).toBeDefined();
    });

    it('should get a currency', async () => {
      // First create a currency to get its ID
      const createRes = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: 'EUR',
          name: 'Euro'
        });
      
      const currencyId = createRes.body.data.id;
      
      const res = await request(app)
        .get(`/api/currencies/${currencyId}/EUR`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isoCode).toBe('EUR');
    });

    it('should list currencies', async () => {
      // First create a currency to get its ID
      const createRes = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: 'GBP',
          name: 'British Pound'
        });
      
      const currencyId = createRes.body.data.id;
      
      const res = await request(app)
        .get(`/api/currencies/${currencyId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('itemList');
    });
  });

  describe('Country Operations', () => {
    it('should create a country', async () => {
      // First create a currency
      const currencyRes = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: 'CAD',
          name: 'Canadian Dollar'
        });
      
      const currencyId = currencyRes.body.data.id;
      
      const res = await request(app)
        .post('/api/countries')
        .send({
          isoCode: testCountryIso,
          name: 'United States',
          currencyIsoCode: 'CAD'
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isoCode).toBe(testCountryIso);
      expect(res.body.data.id).toBeDefined();
    });

    it('should get a country', async () => {
      // First create a currency and country
      const currencyRes = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: 'JPY',
          name: 'Japanese Yen'
        });
      
      const currencyId = currencyRes.body.data.id;
      
      const countryRes = await request(app)
        .post('/api/countries')
        .send({
          isoCode: 'JP',
          name: 'Japan',
          currencyIsoCode: 'JPY'
        });
      
      const countryId = countryRes.body.data.id;
      
      const res = await request(app)
        .get(`/api/countries/${countryId}/JP`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isoCode).toBe('JP');
    });

    it('should list countries', async () => {
      // First create a currency and country
      const currencyRes = await request(app)
        .post('/api/currencies')
        .send({
          isoCode: 'AUD',
          name: 'Australian Dollar'
        });
      
      const currencyId = currencyRes.body.data.id;
      
      const countryRes = await request(app)
        .post('/api/countries')
        .send({
          isoCode: 'AU',
          name: 'Australia',
          currencyIsoCode: 'AUD'
        });
      
      const countryId = countryRes.body.data.id;
      
      const res = await request(app)
        .get(`/api/countries/${countryId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('itemList');
    });
  });
}); 