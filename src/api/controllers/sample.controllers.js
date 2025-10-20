// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.

import sampleService from '../services/sample.services.js';

async function getSamples(req, res, next) {
    await sampleService.getSamples();
}

export default {
    getSamples,
};