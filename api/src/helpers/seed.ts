import { getRepository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import Product from '@Entities/Product';
import User from '@Entities/User';

import { hashPassword } from '~/utils';

export const users = [
  {
    id: uuidv4(),
    name: 'Administrator',
    username: 'admin',
    password: '123456',
    admin: true,
  },
  {
    id: uuidv4(),
    name: 'User',
    username: 'user',
    password: '123456',
    admin: false,
  },
];

export const products = [
  {
    id: uuidv4(),
    name: 'Samsung Galaxy J6',
    slug: 'samsung-galaxy-j6',
    brand: 'Samsung',
    price: 700,
    image:
      'https://images.pexels.com/photos/214487/pexels-photo-214487.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    summary:
      'With a nice end to end display, the Samsung Galaxy J6 is impressive save for its low resolution. That being 1480 X 720 pixels on a 5.6-inch screen which is surprisingly quite colourful mostly because of the AMOLED screen.',
  },
  {
    id: uuidv4(),
    name: 'Apple iPhone X',
    slug: 'apple-iphone-x',
    brand: 'Apple',
    price: 1199,
    image:
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    summary:
      "The iPhone X was Apple's flagship 10th anniversary iPhone featuring a 5.8-inch OLED display, facial recognition and 3D camera functionality, a glass body, and an A11 Bionic processor. Launched November 3, 2017, discontinued with the launch of the iPhone XR, XS, and XS Max",
  },
];

export const populateUsers = async () => {
  const usersToSeed = await Promise.all(
    users.map(async user => {
      return {
        ...user,
        password: await hashPassword(user.password),
      };
    })
  );

  await getRepository(User).save(usersToSeed);
};

export const deleteUser = async (id: string) => {
  await getRepository(User).delete({ id });
};

export const populateProducts = async () => {
  await getRepository(Product).save(products);
};
