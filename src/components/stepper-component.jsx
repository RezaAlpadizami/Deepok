import React from 'react';
import Moment from 'moment';
import { ShoppingCartIcon, ArchiveIcon } from '@heroicons/react/outline';
import RightLeftIcon from '../assets/images/right-left-arrow.svg';
import LeftRightIcon from '../assets/images/left-right-arrow.svg';

function Stepper(props) {
  const { data } = props;

  let counter = 0;
  return (
    <div className="px-4">
      <div>
        {data.map(i => {
          counter += 1;

          return (
            <>
              {counter <= 5 && (
                <div className=" flex">
                  <div className="h-[52px] w-[64px]">
                    <div className="rounded-full bg-white h-full border border-2 border-[#3F73EB] grid place-content-center">
                      {i.activity_name.toLowerCase() === 'inbound' ? (
                        <ArchiveIcon className="h-8 stroke-[#3F73EB]" />
                      ) : i.activity_name.toLowerCase() === 'relocate - in' ? (
                        <img className="h-8" style={{ transform: 'scaleX(-1)' }} alt="right" src={LeftRightIcon} />
                      ) : i.activity_name.toLowerCase() === 'relocate - out' ? (
                        <img className="h-8" alt="right" src={RightLeftIcon} />
                      ) : (
                        <ShoppingCartIcon className="h-8 stroke-[#3F73EB]" />
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex">
                      <h4 className="text-lg pl-1 font-bold">{i.activity_name}</h4>
                      <div className="flex-1" />
                      <div className="text-sm pr-1 pt-1">{i.date ? Moment(i.date).format('DD MMM YYYY') : null}</div>
                    </div>
                    <div>
                      <div>
                        <p className="text-[#000] text-sm pl-1">{i.request_number || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {counter < 5 && (
                <div className="flex">
                  <div className="pr-6" />
                  <div className="border-l-2 border-l-[#3F73EB] h-8" />
                </div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}
export default Stepper;
