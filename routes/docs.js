const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
	swaggerDefinition,
	apis: ['docs/*.yml', 'routes/*.js'],
});

router.use('/', swaggerUi.serve);
router.get('/',
	swaggerUi.setup(specs, {
		explorer: true
	}));

/**
 * @swagger
 * tags:
 *   name: Index
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a user.
 *     tags: [Index]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/User'
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Login.
 *     tags: [Index]
 *     parameters:
 *       - in: header
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         required: true
 *       - in: header
 *         name: pw
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /access_token:
 *   get:
 *     summary: Get access and refresh token.
 *     tags: [Index]
 *     responses:
 *       "200":
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  access_token:
 *                    type: string
 *                  refresh_token:
 *                    type: string
 *                example:
 *                  message: 'Access and refresh token granted successfully!'
 *                  access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
 *                  refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9'
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout
 *     tags: [Index]
 *     responses:
 *       "200":
 *         description: Success
 */

module.exports = router;
