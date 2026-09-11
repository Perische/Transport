# MoveIt

MoveIt is a full-stack transport and delivery marketplace that connects customers with available drivers for package pickup and delivery.

## Project Overview

MoveIt allows customers to request deliveries and allows registered drivers to accept and complete those delivery requests.

The application has two main user roles:

- Customer
- Driver

## Features

### Customer

- Create an account
- Login
- Request a delivery
- Enter pickup location
- Enter delivery location
- Describe a package
- View delivery requests
- Track delivery status
- View delivery history

### Driver

- Create an account
- Login
- Create a driver profile
- Add vehicle information
- Set availability
- View available deliveries
- Accept deliveries
- Update delivery status
- View assigned deliveries

## Delivery Status

A delivery can move through the following stages:

```text
Pending
   ↓
Assigned
   ↓
Picked Up
   ↓
In Transit
   ↓
Delivered