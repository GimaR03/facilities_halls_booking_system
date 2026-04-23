import { useState, useMemo, useEffect } from "react";
import {
  fetchBuildings,
  fetchRooms,
  createBuilding,
  updateBuilding as updateBuildingApi,
  deleteBuilding as deleteBuildingApi,
  addFloor,
  updateFloor as updateFloorApi,
  deleteFloor as deleteFloorApi,
  createRoom,
  updateRoom as updateRoomApi,
  deleteRoom as deleteRoomApi,
} from "../api/campusApi";
import { withSeconds, roomStatusCount as calculateRoomStatusCount } from "../A_helpers";
import { roomStatuses } from "../A_constants";

export function useCampusResources({ setErrorMessage, setSuccessMessage, setIsLoading }) {
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);

  // Form states
  const [buildingForm, setBuildingForm] = useState({
    buildingNo: "",
    name: "",
    floorCount: 1,
  });
  const [editingBuildingId, setEditingBuildingId] = useState(null);

  const [floorForm, setFloorForm] = useState({
    buildingId: "",
    floorNumber: "",
    label: "",
  });
  const [editingFloorId, setEditingFloorId] = useState(null);

  const [roomForm, setRoomForm] = useState({
    buildingId: "",
    floorId: "",
    name: "",
    type: "LAB",
    capacity: 40,
    location: "Block",
    availabilityStart: "08:00",
    availabilityEnd: "18:00",
    status: "ACTIVE",
    description: "",
  });
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Memoized stats and derived data
  const selectedRoomBuilding = useMemo(
    () => buildings.find((b) => String(b.id) === roomForm.buildingId),
    [buildings, roomForm.buildingId]
  );

  const selectedBuildingFloors = selectedRoomBuilding?.floors || [];

  const roomStatusCount = useMemo(
    () =>
      roomStatuses.reduce(
        (acc, status) => ({
          ...acc,
          [status]: rooms.filter((r) => r.status === status).length,
        }),
        {}
      ),
    [rooms]
  );

  const totalFloors = useMemo(
    () => buildings.reduce((count, b) => count + (b.floors?.length || 0), 0),
    [buildings]
  );

  const totalCapacity = useMemo(
    () => rooms.reduce((count, r) => count + (r.capacity || 0), 0),
    [rooms]
  );

  const activeCapacity = useMemo(
    () => rooms.filter((r) => r.status === "ACTIVE").reduce((count, r) => count + (r.capacity || 0), 0),
    [rooms]
  );

  const maintenanceCapacity = useMemo(
    () => rooms.filter((r) => r.status === "MAINTENANCE").reduce((count, r) => count + (r.capacity || 0), 0),
    [rooms]
  );

  const selectedMapBuilding = useMemo(
    () => buildings.find((b) => String(b.id) === String(selectedBuildingId)) || null,
    [buildings, selectedBuildingId]
  );

  const selectedBuildingRooms = useMemo(
    () => (selectedMapBuilding ? rooms.filter((r) => r.buildingId === selectedMapBuilding.id) : []),
    [rooms, selectedMapBuilding]
  );

  const selectedBuildingStats = useMemo(() => {
    const roomCount = selectedBuildingRooms.length;
    return {
      roomCount,
      activeCount: selectedBuildingRooms.filter((r) => r.status === "ACTIVE").length,
      inactiveCount: selectedBuildingRooms.filter((r) => r.status === "INACTIVE").length,
      maintenanceCount: selectedBuildingRooms.filter((r) => r.status === "MAINTENANCE").length,
      totalCapacity: selectedBuildingRooms.reduce((count, r) => count + (r.capacity || 0), 0),
    };
  }, [selectedBuildingRooms]);

  const selectedFloorInsights = useMemo(() => {
    if (!selectedMapBuilding) return [];
    return selectedMapBuilding.floors
      .map((floor) => {
        const floorRooms = selectedBuildingRooms.filter((r) => r.floorId === floor.id);
        return {
          ...floor,
          rooms: floorRooms,
          roomCount: floorRooms.length,
          activeCount: floorRooms.filter((r) => r.status === "ACTIVE").length,
          inactiveCount: floorRooms.filter((r) => r.status === "INACTIVE").length,
          maintenanceCount: floorRooms.filter((r) => r.status === "MAINTENANCE").length,
          capacity: floorRooms.reduce((count, r) => count + (r.capacity || 0), 0),
        };
      })
      .sort((a, b) => a.floorNumber - b.floorNumber);
  }, [selectedMapBuilding, selectedBuildingRooms]);

  // Handlers
  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const loadResources = async () => {
    try {
      const [bData, rData] = await Promise.all([fetchBuildings(), fetchRooms()]);
      setBuildings(bData);
      setRooms(rData);
      if (bData.length > 0 && !selectedBuildingId) {
        setSelectedBuildingId(bData[0].id);
      }
      return { buildings: bData, rooms: rData };
    } catch (error) {
      setErrorMessage(error.message);
      throw error;
    }
  };

  const handleCreateBuilding = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const isEditing = editingBuildingId !== null;
      const payload = {
        buildingNo: buildingForm.buildingNo.trim(),
        name: buildingForm.name.trim(),
        floorCount: Number(buildingForm.floorCount),
      };

      const saved = isEditing
        ? await updateBuildingApi(editingBuildingId, payload)
        : await createBuilding(payload);

      setBuildings((current) => {
        const updated = isEditing
          ? current.map((item) => (item.id === editingBuildingId ? saved : item))
          : [...current, saved];
        return updated.sort((a, b) => a.buildingNo.localeCompare(b.buildingNo, undefined, { numeric: true }));
      });

      setBuildingForm({ buildingNo: "", name: "", floorCount: 1 });
      setEditingBuildingId(null);
      setSuccessMessage(isEditing ? `Building ${saved.name} updated.` : `Building ${saved.name} added.`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const isEditing = editingFloorId !== null;
      const payload = {
        floorNumber: Number(floorForm.floorNumber),
        label: floorForm.label.trim(),
      };

      const saved = isEditing
        ? await updateFloorApi(editingFloorId, payload)
        : await addFloor(Number(floorForm.buildingId), payload);

      const targetId = isEditing
        ? buildings.find((b) => b.floors.some((f) => f.id === editingFloorId))?.id || Number(floorForm.buildingId)
        : Number(floorForm.buildingId);

      setBuildings((current) =>
        current.map((b) =>
          String(b.id) === String(targetId)
            ? {
                ...b,
                floors: isEditing
                  ? b.floors.map((f) => (f.id === editingFloorId ? saved : f)).sort((a, b) => a.floorNumber - b.floorNumber)
                  : [...b.floors, saved].sort((a, b) => a.floorNumber - b.floorNumber),
              }
            : b
        )
      );

      setFloorForm((prev) => ({ ...prev, floorNumber: "", label: "" }));
      setEditingFloorId(null);
      setSuccessMessage(isEditing ? `Floor ${saved.label} updated.` : `Floor ${saved.label} added.`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const isEditing = editingRoomId !== null;
      const payload = {
        buildingId: Number(roomForm.buildingId),
        floorId: Number(roomForm.floorId),
        name: roomForm.name.trim(),
        type: roomForm.type,
        capacity: Number(roomForm.capacity),
        location: roomForm.location.trim(),
        availabilityStart: withSeconds(roomForm.availabilityStart),
        availabilityEnd: withSeconds(roomForm.availabilityEnd),
        status: roomForm.status,
        description: roomForm.description.trim(),
      };

      const saved = isEditing ? await updateRoomApi(editingRoomId, payload) : await createRoom(payload);

      setRooms((current) => (isEditing ? current.map((r) => (r.id === editingRoomId ? saved : r)) : [saved, ...current]));
      setRoomForm((prev) => ({ ...prev, floorId: "", name: "", description: "" }));
      setEditingRoomId(null);
      setSuccessMessage(isEditing ? `Room ${saved.name} updated.` : `Room ${saved.name} created.`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditBuilding = (b) => {
    clearMessages();
    setEditingBuildingId(b.id);
    setBuildingForm({ buildingNo: b.buildingNo, name: b.name, floorCount: b.floors.length });
  };

  const handleDeleteBuilding = async (b) => {
    clearMessages();
    if (!window.confirm(`Delete building ${b.name}?`)) return;
    try {
      await deleteBuildingApi(b.id);
      setBuildings((current) => current.filter((item) => item.id !== b.id));
      setSuccessMessage("Building deleted.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditFloor = (f) => {
    clearMessages();
    setEditingFloorId(f.id);
    setFloorForm({ buildingId: String(f.buildingId), floorNumber: String(f.floorNumber), label: f.label });
  };

  const handleDeleteFloor = async (f) => {
    clearMessages();
    if (!window.confirm(`Delete floor ${f.label}?`)) return;
    try {
      await deleteFloorApi(f.id);
      setBuildings((current) =>
        current.map((b) => ({ ...b, floors: b.floors.filter((item) => item.id !== f.id) }))
      );
      setSuccessMessage("Floor deleted.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEditRoom = (r) => {
    clearMessages();
    setEditingRoomId(r.id);
    setRoomForm({
      buildingId: String(r.buildingId),
      floorId: String(r.floorId),
      name: r.name,
      type: r.type,
      capacity: String(r.capacity),
      location: r.location,
      availabilityStart: r.availabilityStart.slice(0, 5),
      availabilityEnd: r.availabilityEnd.slice(0, 5),
      status: r.status,
      description: r.description,
    });
  };

  const handleDeleteRoom = async (r) => {
    clearMessages();
    if (!window.confirm(`Delete room ${r.name}?`)) return;
    try {
      await deleteRoomApi(r.id);
      setRooms((current) => current.filter((item) => item.id !== r.id));
      setSuccessMessage("Room deleted.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRoomBuildingChange = (bId) => {
    setRoomForm((prev) => ({ ...prev, buildingId: bId, floorId: "" }));
  };

  const handleCancelBuildingEdit = () => {
    setEditingBuildingId(null);
    setBuildingForm({ buildingNo: "", name: "", floorCount: 1 });
  };

  const handleCancelFloorEdit = () => {
    setEditingFloorId(null);
    setFloorForm({ buildingId: "", floorNumber: "", label: "" });
  };

  const handleCancelRoomEdit = () => {
    setEditingRoomId(null);
    setRoomForm({
      buildingId: "",
      floorId: "",
      name: "",
      type: "LAB",
      capacity: 40,
      location: "Block",
      availabilityStart: "08:00",
      availabilityEnd: "18:00",
      status: "ACTIVE",
      description: "",
    });
  };

  return {
    buildings,
    rooms,
    selectedBuildingId,
    setSelectedBuildingId,
    buildingForm,
    setBuildingForm,
    editingBuildingId,
    floorForm,
    setFloorForm,
    editingFloorId,
    roomForm,
    setRoomForm,
    editingRoomId,
    selectedRoomBuilding,
    selectedBuildingFloors,
    roomStatusCount,
    totalFloors,
    totalCapacity,
    activeCapacity,
    maintenanceCapacity,
    selectedMapBuilding,
    selectedBuildingRooms,
    selectedBuildingStats,
    selectedFloorInsights,
    loadResources,
    handleCreateBuilding,
    handleAddFloor,
    handleCreateRoom,
    handleEditBuilding,
    handleDeleteBuilding,
    handleEditFloor,
    handleDeleteFloor,
    handleEditRoom,
    handleDeleteRoom,
    handleRoomBuildingChange,
    handleCancelBuildingEdit,
    handleCancelFloorEdit,
    handleCancelRoomEdit,
  };
}
