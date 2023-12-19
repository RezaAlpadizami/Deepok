import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react-lite';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import LoadingHover from '../../../components/loading-hover-component';
import TextArea from '../../../components/textarea-component';
import { UomApi } from '../../../services/api-master';
import Input from '../../../components/input-component';

const schema = yup.object().shape({
  code: yup.string().nullable().max(7).required(),
  name: yup.string().nullable().max(50).required(),
  description: yup.string().max(255),
});

function Screen(props) {
  const { route, displayName } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    UomApi.find(id)
      .then(res => {
        setValue('code', res.code);
        setValue('name', res.name);
        setValue('description', res.description);
        setLoading(false);
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  const onSubmit = data => {
    setLoading(true);
    UomApi.update(id, {
      code: data.code,
      name: data.name,
      description: data.description,
    })
      .then(() => {
        setLoading(false);
        Swal.fire({ text: 'Successfully Saved', icon: 'success' });
        navigate(route.split('/').slice(0, 3).join('/'));
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-12">
          <button type="button">
            <ChevronLeftIcon className="pointer-events-auto h-6 stroke-2" onClick={() => navigate(-1)} />
          </button>
          <h1 className="font-bold text-xl">{displayName}</h1>
          <div className="flex-1" />
          <div>
            <Button
              onClick={() => navigate(-1)}
              px={8}
              size="sm"
              className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              px={8}
              type="submit"
              className="ml-4 rounded-md bg-[#50B8C1] drop-shadow-md text-[#fff] font-bold hover:text-[#E4E4E4]"
            >
              Save
            </Button>
          </div>
        </div>

        <div className="grid items-start justify-items-center w-[80%] gap-4 gap-y-12 ml-6 mb-4 grid-cols-2 mt-4">
          <Input name="code" label="Code" maxLength="15" register={register} errors={errors} disabled />
          <TextArea name="description" label="Description" maxLength="255" register={register} errors={errors} />
          <Input name="name" label="name" register={register} errors={errors} />
        </div>
      </form>
      {loading && <LoadingHover fixed />}
    </div>
  );
}
export default observer(Screen);
