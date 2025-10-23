import prisma from '../../common/prisma.js';

async function getSamples() {
  prisma.sample.find();
  // 비즈니스 로직 처리
  return [{ id: 1, name: 'Sample Item' }];
}

export default {
  getSamples,
};
