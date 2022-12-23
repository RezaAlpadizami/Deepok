import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import Swal from 'sweetalert2';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import LoadingHover from '../../../components/loading-hover-component';
import { CategoryApi } from '../../../services/api-master';
import Input from '../../../components/input-component';

function Screen(props) {
  const { displayName, route } = props;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().nullable().max(7).required(),
    name: yup.string().nullable().max(100).required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onAddCategory = data => {
    setLoading(true);
    CategoryApi.store({
      code: data.code,
      name: data.name,
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onAddCategory)}>
        <div className="flex mb-12">
          <h1 className="font-bold text-3xl">{displayName}</h1>
          <div className="flex-1" />
          <Button
            onClick={() => navigate(-1)}
            px={8}
            size="sm"
            className="rounded-full bg-[#aaa] outline outline-offset-0 outline-[#1F2022] text-[#fff] font-bold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            px={8}
            type="submit"
            className="ml-4 rounded-full outline outline-offset-0 outline-[#232323] bg-[#232323] text-[#fff] font-bold"
          >
            Save
          </Button>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" register={register} errors={errors} />
          <Input name="name" label="Category" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default Screen;
