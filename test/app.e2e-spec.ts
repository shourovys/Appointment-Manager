import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let staffId: string;
  let serviceId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  describe('End-to-End Flow Testing', () => {
    it('should complete full user registration and login flow', async () => {
      // Register new user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(registerResponse.body.data).toHaveProperty('token');
      authToken = registerResponse.body.data.token;

      // Login with registered user
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(loginResponse.body.data).toHaveProperty('token');
      authToken = loginResponse.body.data.token;

      // Get user profile
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(profileResponse.body.data.email).toBe('test@example.com');
    });

    it('should create staff and service, then book appointment', async () => {
      // Create staff
      const staffResponse = await request(app.getHttpServer())
        .post('/staff')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          serviceType: 'General',
          dailyCapacity: 5,
          availabilityStatus: 'Available',
        })
        .expect(201);

      staffId = staffResponse.body.data.id;

      // Create service
      const serviceResponse = await request(app.getHttpServer())
        .post('/services-definition')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'General Checkup',
          duration: 30,
          requiredStaffType: 'General',
        })
        .expect(201);

      serviceId = serviceResponse.body.data.id;

      // Create appointment
      const appointmentResponse = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerName: 'Jane Smith',
          serviceId,
          staffId,
          appointmentDate: '2024-01-01',
          appointmentTime: '10:00',
        })
        .expect(201);

      expect(appointmentResponse.body.data.status).toBe('Scheduled');
    });

    it('should handle capacity limits and queue management', async () => {
      // Create multiple appointments to reach capacity
      for (let i = 1; i <= 5; i++) {
        await request(app.getHttpServer())
          .post('/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            customerName: `Patient ${i}`,
            serviceId,
            staffId,
            appointmentDate: '2024-01-01',
            appointmentTime: `1${i}:00`,
          })
          .expect(201);
      }

      // Next appointment should go to queue
      const queueAppointmentResponse = await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerName: 'Queued Patient',
          serviceId,
          staffId,
          appointmentDate: '2024-01-01',
          appointmentTime: '16:00',
        })
        .expect(201);

      expect(queueAppointmentResponse.body.data.status).toBe('Waiting');

      // Check queue
      const queueResponse = await request(app.getHttpServer())
        .get('/appointments/queue')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(queueResponse.body.data.length).toBeGreaterThan(0);

      // Assign from queue
      const assignResponse = await request(app.getHttpServer())
        .post(`/appointments/queue/assign/${staffId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(assignResponse.body.data.status).toBe('Scheduled');
    });

    it('should handle time conflicts', async () => {
      // Try to create conflicting appointment
      await request(app.getHttpServer())
        .post('/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customerName: 'Conflict Patient',
          serviceId,
          staffId,
          appointmentDate: '2024-01-01',
          appointmentTime: '10:00', // Same time as existing
        })
        .expect(409); // Conflict
    });

    it('should provide dashboard stats and activity logs', async () => {
      // Get dashboard stats
      const statsResponse = await request(app.getHttpServer())
        .get('/dashboard/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(statsResponse.body.data).toHaveProperty('totalAppointments');
      expect(statsResponse.body.data).toHaveProperty('completed');
      expect(statsResponse.body.data).toHaveProperty('pending');
      expect(statsResponse.body.data).toHaveProperty('waitingQueueCount');

      // Get activity logs
      const logsResponse = await request(app.getHttpServer())
        .get('/activity-logs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(logsResponse.body.data)).toBe(true);
    });

    it('should handle demo user login', async () => {
      // Login with demo user
      const demoLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'demo@example.com',
          password: 'demo123',
        })
        .expect(200);

      expect(demoLoginResponse.body.data).toHaveProperty('token');
    });
  });
});
