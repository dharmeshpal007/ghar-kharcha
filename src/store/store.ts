import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import boilerPlateStore from "./storeActions";

const useBoilerPlateStore = create(devtools(persist(boilerPlateStore, { name: "boilerPlate" })));

export default useBoilerPlateStore;
