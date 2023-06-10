import { SAMPLE_GROUP_CODE_DATA_LIST } from '../constant/groupCode';

export const generateGroupCode = () => {
  const randomIndex = Math.floor(
    (Math.random() * SAMPLE_GROUP_CODE_DATA_LIST.length) %
      SAMPLE_GROUP_CODE_DATA_LIST.length
  );

  return SAMPLE_GROUP_CODE_DATA_LIST[randomIndex].code;
};
