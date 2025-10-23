// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeService from '../services/challenge.inquiry.services.js';

async function getChallengeList(req, res, next) {
  const listData = await challengeService.getChallengeList();
  res.status(200).json(listData);
}

export default {
  getChallengeList,
};
