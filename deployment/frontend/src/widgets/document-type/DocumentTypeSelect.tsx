import React, { Dispatch, type ReactElement, SetStateAction, useEffect, useState } from 'react';
import { message, SelectProps } from 'antd';
import axios from 'axios';
import { BaseSelect } from '@/features/select/BaseSelect.tsx';
import styled from 'styled-components';

export interface IChooseFileType {
  value: string;
}
interface IDocumentTypeSelect {
  chooseFileType: IChooseFileType;
  setChooseFileType: Dispatch<SetStateAction<IChooseFileType>>;
  placeholder: string;
  defaultSelection?: boolean;
}
export const DocumentTypeSelect = ({
  chooseFileType,
  placeholder,
  setChooseFileType,
  defaultSelection,
}: IDocumentTypeSelect): ReactElement => {
  const [fileType, setFileType] = useState<SelectProps['options']>([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = (await axios.get(`${import.meta.env.VITE_API_URL}/types`)).data;
        if (isMounted) {
          const options = response.map((elem, i) => ({ value: elem }));
          setFileType(options);
          defaultSelection && setChooseFileType(options[0]);
        }
      } catch (e) {
        messageApi.error(`Ошибка загрузки: ${e}`);
      }
    };
    void fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <StyledSelect
      options={fileType}
      onSelect={v => setChooseFileType({ value: v })}
      value={chooseFileType}
      placeholder={placeholder}
    >
      {contextHolder}
    </StyledSelect>
  );
};

const StyledSelect = styled(BaseSelect)`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;