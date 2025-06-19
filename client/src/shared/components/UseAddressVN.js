import axios from "axios";
import { useEffect, useState } from "react";
import { MAP_URL } from "../constants/app";


const UseAddressVN = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedWardCode, setSelectedWardCode] = useState("");

  useEffect(() => {
    axios.get(`${MAP_URL}/p`).then((res) => setProvinces(res.data));
  }, []);

  useEffect(() => {
    if (selectedProvinceCode) {
      axios
        .get(`${MAP_URL}/p/${selectedProvinceCode}?depth=2`)
        .then((res) => setDistricts(res.data.districts));
    } else {
      setDistricts([]);
    }
    setSelectedDistrictCode("");
    setSelectedWardCode("");
  }, [selectedProvinceCode]);

  useEffect(() => {
    if (selectedDistrictCode) {
      axios
        .get(`${MAP_URL}/d/${selectedDistrictCode}?depth=2`)
        .then((res) => setWards(res.data.wards));
    } else {
      setWards([]);
    }
    setSelectedWardCode("");
  }, [selectedDistrictCode]);

  return {
    provinces,
    districts,
    wards,
    selectedProvinceCode,
    selectedDistrictCode,
    selectedWardCode,
    setSelectedProvinceCode,
    setSelectedDistrictCode,
    setSelectedWardCode,
  };
};

export default UseAddressVN;

