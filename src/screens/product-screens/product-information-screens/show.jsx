import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductInfoApi, ProductJourney } from '../../../services/api-master';
import InputDetail from '../../../components/input-detail-component';
import LoadingComponent from '../../../components/loading-component';
import Stepper from '../../../components/stepper-component';

function ShowScreen(props) {
  const { displayName } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [dataJourney, setDataJourney] = useState([]);
  const [storageDetails, setStorageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingJourney, setLoadingJourney] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadingJourney(true);
    Promise.allSettled([
      ProductJourney.find(id).then(res => {
        return res;
      }),
      ProductInfoApi.find(id).then(res => {
        return res;
      }),
    ])
      .then(result => {
        if (result[0].status === 'fulfilled' && result[1].status === 'fulfilled') {
          setData(result[1].value);
          const filterWarehouseInfo = [
            ...new Map(
              result[1].value?.product.product_info.map(i => [JSON.stringify(i.warehouse_id), i.warehouse_id])
            ).values(),
          ];

          const body = {
            storage_details: filterWarehouseInfo.map(f => {
              return {
                list: result[1].value.product.product_info
                  .filter(s => s.warehouse_id === f)
                  .map((i, idx) => {
                    return {
                      warehouse: i.warehouse_name,
                      warehouse_id: i.warehouse_id,
                      total_item: idx + 1,
                      storage: [
                        {
                          rack: i.rack,
                          bay: i.bay,
                          level: i.level,
                          total: i.qty || 2,
                        },
                      ],
                    };
                  }),
              };
            }),
          };

          if (body.storage_details.length > 0) {
            setStorageDetails(
              body.storage_details.map((i, idx) => {
                return {
                  storage: i.list
                    .filter(f => f.warehouse_id === filterWarehouseInfo[idx])
                    .map(m => {
                      return m.storage[0];
                    }),
                  warehouse: i.list.length > 0 ? i.list[idx]?.warehouse : '',
                  total: i.list.length > 0 ? i.list[idx]?.total_item : 0,
                };
              })
            );
          }

          setDataJourney(
            result[0].value.journey.map(i => {
              return {
                activity_name: i.activity_name,
                request_number: i.request_number,
                date: i.activity_date,
              };
            })
          );

          setLoadingJourney(false);
          setLoading(false);
        } else if (result[0].status === 'rejected' || result[1].status === 'rejected') {
          if (result[0].status === 'rejected') {
            Swal.fire({ text: `${result[0].reason?.message}`, icon: 'error' });
          } else if (result[1].status === 'rejected') {
            Swal.fire({ text: `${result[1].reason?.message}`, icon: 'error' });
          } else {
            Swal.fire({ text: 'Something Went Wrong', icon: 'error' });
          }
        }
      })
      .catch(error => {
        Swal.fire({ text: error?.message, icon: 'error' });
      });
  }, []);

  // const steps = dataJourney.length > 5 ? dataJourney.splice(-Number(`${dataJourney.length - 5}`)) : dataJourney;

  return (
    <>
      <div className="flex mb-12">
        <button type="button">
          <ChevronLeftIcon className="pointer-events-auto h-10 stroke-2" onClick={() => navigate(-1)} />
        </button>
        <h1 className="font-bold text-3xl">{displayName}</h1>
        <div className="flex-1" />
      </div>
      <div className="grid grid-flow-row-dense grid-cols-3">
        <div className="col-span-2">
          <div className="col-span-2 px-4">
            <strong>Detail Product</strong>
            <div className="bg-white h-full rounded-2xl mt-3">
              <div className="grid ml-10 grid-cols-2 pb-5 pr-5  ">
                <InputDetail value={data?.product.product_name || '-'} label="Name" swapBold />
                <InputDetail value={data?.product.product_category || '-'} label="Category" swapBold />
                <InputDetail value={data?.product.product_sku || '-'} label="SKU" swapBold />
                <InputDetail value={data?.product.product_desc || '-'} label="Desc" swapBold />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 px-4 mt-4">
          <div className="grid grid-row-2">
            <strong>Storage Details</strong>
            <div>
              <div className="flex bg-white rounded-2xl h-10 mt-2 px-5 py-2">
                <p>Total Product</p>
                <div className="flex-1" />
                <strong className="mr-5">{data?.qty}</strong>
              </div>
            </div>
            <div className="h-[300px] pb-4">
              <div
                className={`bg-white rounded-2xl mt-5 p-5 h-full ${
                  storageDetails.length > 1 ? 'overflow-y-scroll' : ''
                }`}
              >
                <strong className="text-gray-400">Warehouse</strong>
                <LoadingComponent visible={loading} />
                {storageDetails.map((i, idx) => {
                  return (
                    <>
                      <div className="flex mb-2 mt-2" key={idx}>
                        <strong>{i.warehouse}</strong>
                        <div className="flex-1" />
                        <strong className="mr-5">{i.total}</strong>
                      </div>
                      {i.storage.map((s, sIdx) => {
                        return (
                          <div className="grid grid-cols-8 " key={sIdx}>
                            <div className="mb-3">
                              <p className="mb-2 text-gray-400">Rack</p>
                              <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                {s.rack}
                              </button>
                            </div>
                            <div className="mb-3">
                              <p className="mb-2 text-gray-400 w-20">Bay</p>
                              <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                {s.bay}
                              </button>
                            </div>
                            <div>
                              <p className="mb-2 text-gray-400 w-20">Level</p>
                              <button type="button" className="bg-slate-300 outline outline-1 rounded-lg px-6">
                                {s.level}
                              </button>
                            </div>
                            <div className="col-span-4" />
                            <div className="my-auto mr-5 flex">
                              <div className="flex-1" />
                              <strong>{s.total}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-2 pl-1">
          <strong>Product Journey</strong>
          <div className="bg-white h-[95%] rounded-3xl mt-2 pt-10 pl-3 pr-3">
            <LoadingComponent visible={loadingJourney} />
            <Stepper data={dataJourney} />
            {dataJourney.length >= 5 && (
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => navigate(`/product/product-journey/${id}/show`)}
                  className="bg-[#232323] text-white  border border-gray-500 text-md rounded-xl border-3 py-1 px-8 hover:bg-black mt-5"
                >
                  More
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowScreen;
