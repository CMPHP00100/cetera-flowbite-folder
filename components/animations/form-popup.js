import { motion } from "framer-motion";
import Image from "next/image";

const FormPopup = ({ isVisible, onClose, alertMessage }) => {
  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-black bg-opacity/50 fixed inset-0 flex items-center justify-center"
      >
        <div className="row flex size-[400px] justify-center rounded-lg border border-cetera-orange bg-dark-blue p-6 text-center shadow">
          <div class="col-sm-12">
            <Image
              src="/assets/logos/CM_logo_Gray.svg"
              className="h-8 mr-3 ms-5 mt-2"
              alt="Cétera Marketing"
              width="200"
              height="100"
            />
          </div>
          <div class="col-sm-12">
            <p className="text-lg font-semibold text-cetera-orange">
              {alertMessage}
            </p>
            <button
              className="mt-4 rounded bg-cetera-orange px-4 py-2 text-white hover:bg-cetera-orange"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
};

export default FormPopup;
