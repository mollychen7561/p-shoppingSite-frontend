import {
  TruckIcon,
  ChatBubbleBottomCenterTextIcon,
  GlobeAsiaAustraliaIcon,
  ReceiptPercentIcon
} from "@heroicons/react/24/outline";

export default function Announcement() {
  return (
    <div className="mx-auto my-5 grid w-10/12 gap-4 px-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1">
      <section className="flex flex-row rounded-md border-2 px-5 py-6 shadow-md w-full">
        <div className="flex flex-row text-center rouned-md">
          <div className="my-auto mr-4">
            <TruckIcon className="h-6 w-6" />
          </div>
          <div className="my-auto">
            <h3 className="font-semibold">Delivery within 2-3 days</h3>
          </div>
        </div>
      </section>

      <section className="flex flex-row rounded-md border-2 px-5 py-3 shadow-md w-full">
        <div className="flex flex-row text-center rouned-md">
          <div className="my-auto mr-4">
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          </div>
          <div className="my-auto">
            <h3 className="font-semibold">Customer service</h3>
          </div>
        </div>
      </section>

      <section className="flex flex-row rounded-md border-2 px-5 py-3 shadow-md w-full">
        <div className="flex flex-row text-center  rouned-md">
          <div className="my-auto mr-4">
            <GlobeAsiaAustraliaIcon className="h-6 w-6" />
          </div>
          <div className="my-auto">
            <h3 className="font-semibold">Sustainable packaging</h3>
          </div>
        </div>
      </section>

      <section className="flex flex-row rounded-md border-2 px-5 py-3 shadow-md w-full">
        <div className="flex flex-row text-center rouned-md">
          <div className="my-auto mr-4">
            <ReceiptPercentIcon className="h-6 w-6" />
          </div>
          <div className="my-auto">
            <h3 className="font-semibold">Opening event</h3>
          </div>
        </div>
      </section>
    </div>
  );
}
