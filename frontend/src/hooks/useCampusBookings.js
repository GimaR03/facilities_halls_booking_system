import { useEffect, useMemo, useState } from "react";
import {
  createBookingRequest,
  fetchMyBookings,
  cancelBooking,
  fetchAllBookingsForAdmin,
  approveBooking,
  rejectBooking,
} from "../api/campusApi";
import { getCurrentDateTimeValue } from "../A_helpers";
import {
  clearNotificationsForUser,
  createNotification,
  getNotificationsForUser,
  markNotificationsAsRead,
} from "../notificationUtils";

export function useCampusBookings({ 
  setErrorMessage, 
  setSuccessMessage, 
  authUser, 
  clearMessages, 
  systemNotifications, 
  setSystemNotifications,
  addSystemNotification,
  buildings = [],
  rooms = []
}) {
  const [bookingUserId, setBookingUserId] = useState("1");
  const [bookingForm, setBookingForm] = useState({
    resourceId: "",
    date: getCurrentDateTimeValue().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    purpose: "",
    expectedAttendees: "10",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingStatus, setShowBookingStatus] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  const [adminBookings, setAdminBookings] = useState([]);
  const [adminBookingsLoading, setAdminBookingsLoading] = useState(false);
  const [adminBookingFilters, setAdminBookingFilters] = useState({
    resourceId: "",
    date: "",
    status: "",
    requestedByUserId: "",
  });

  const loadMyBookings = async (user = authUser) => {
    if (!user?.userId && !bookingUserId) return;
    const uid = user?.userId || bookingUserId;
    try {
      const data = await fetchMyBookings({ 
        userId: uid, 
        role: user?.role || authUser?.role 
      });
      setMyBookings(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    clearMessages();
    setBookingLoading(true);
    try {
      const selectedRoom = rooms.find(
        (room) => String(room.id) === String(bookingForm.resourceId)
      );

      if (!selectedRoom) {
        throw new Error("Please choose a valid room before submitting the booking.");
      }

      if (selectedRoom.status !== "ACTIVE") {
        throw new Error("Selected room is not available for booking.");
      }

      const payload = {
        requestedByUserId: Number(bookingUserId),
        resourceId: Number(bookingForm.resourceId),
        date: bookingForm.date,
        startTime: `${bookingForm.startTime}:00`,
        endTime: `${bookingForm.endTime}:00`,
        purpose: bookingForm.purpose.trim(),
        expectedAttendees: Number(bookingForm.expectedAttendees),
      };
      await createBookingRequest(payload, { 
        userId: authUser?.userId || bookingUserId, 
        role: authUser?.role 
      });
      setSuccessMessage("Booking request submitted!");
      loadMyBookings();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelMyBooking = async (booking) => {
    clearMessages();
    try {
      await cancelBooking(booking.id, { 
        userId: authUser?.userId || bookingUserId, 
        role: authUser?.role 
      }, "User cancelled");
      setSuccessMessage("Booking cancelled.");
      loadMyBookings();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const loadAdminBookings = async () => {
    if (!authUser) return;
    try {
      const data = await fetchAllBookingsForAdmin(adminBookingFilters, { 
        role: authUser.role 
      });
      setAdminBookings(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setAdminBookingsLoading(false);
    }
  };

  const handleAdminApprove = async (booking) => {
    clearMessages();
    const reason = window.prompt("Approval reason (optional):", "Approved by Admin");
    try {
      await approveBooking(booking.id, reason, { 
        role: authUser.role 
      });
      setSuccessMessage(`Booking #${booking.id} approved.`);
      addSystemNotification(
        createNotification({
          type: "BOOKING_APPROVED",
          category: "BOOKING",
          recipientUserId: booking.requestedByUserId,
          title: `Booking #${booking.id} approved`,
          message: reason
            ? `Your booking request for resource ${booking.resourceId} on ${booking.date} was approved. Note: ${reason}`
            : `Your booking request for resource ${booking.resourceId} on ${booking.date} was approved.`,
        })
      );
      loadAdminBookings();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAdminReject = async (booking) => {
    clearMessages();
    const reason = window.prompt("Rejection reason:", "Rejected by Admin");
    if (reason === null) return;
    try {
      await rejectBooking(booking.id, reason, { 
        role: authUser.role 
      });
      setSuccessMessage(`Booking #${booking.id} rejected.`);
      addSystemNotification(
        createNotification({
          type: "BOOKING_REJECTED",
          category: "BOOKING",
          recipientUserId: booking.requestedByUserId,
          title: `Booking #${booking.id} rejected`,
          message: reason
            ? `Your booking request for resource ${booking.resourceId} on ${booking.date} was rejected. Reason: ${reason}`
            : `Your booking request for resource ${booking.resourceId} on ${booking.date} was rejected.`,
        })
      );
      loadAdminBookings();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const bookNotifications = useMemo(
    () =>
      getNotificationsForUser(
        systemNotifications,
        authUser?.userId,
        (notification) => notification.category === "BOOKING"
      ),
    [systemNotifications, authUser]
  );

  const adminNotifications = useMemo(
    () => systemNotifications.filter((n) => n.target === "ADMIN"),
    [systemNotifications]
  );

  const bookUnreadCount = useMemo(
    () => bookNotifications.filter((notification) => !notification.read).length,
    [bookNotifications]
  );

  const clearBookNotifications = () => {
    setSystemNotifications((prev) =>
      clearNotificationsForUser(
        prev,
        authUser?.userId,
        (notification) => notification.category === "BOOKING"
      )
    );
  };

  const markBookNotificationsRead = () => {
    setSystemNotifications((prev) =>
      markNotificationsAsRead(
        prev,
        authUser?.userId,
        (notification) => notification.category === "BOOKING"
      )
    );
  };

  const clearAdminNotifications = () => {
    setSystemNotifications((prev) => prev.filter((n) => n.target !== "ADMIN"));
  };

  const [bookRoomSelectedBuildingId, setBookRoomSelectedBuildingId] = useState(null);
  const [bookRoomSelectedFloorId, setBookRoomSelectedFloorId] = useState(null);

  const bookRoomLocationOptions = useMemo(() => {
    const buildingMap = new Map(
      buildings.map((building) => [String(building.id), building])
    );
    const seen = new Set();

    return rooms
      .map((room) => {
        const building = buildingMap.get(String(room.buildingId));
        if (!building) {
          return null;
        }

        const floor = (building.floors || []).find(
          (item) => String(item.id) === String(room.floorId)
        );
        if (!floor) {
          return null;
        }

        const key = `${building.id}_${floor.id}`;
        if (seen.has(key)) {
          return null;
        }
        seen.add(key);

        return {
          value: key,
          buildingId: String(building.id),
          floorId: String(floor.id),
          buildingNo: building.buildingNo,
          buildingName: building.name,
          floorNumber: floor.floorNumber,
          floorLabel: floor.label,
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const buildingCompare = String(a.buildingNo).localeCompare(String(b.buildingNo), undefined, {
          numeric: true,
        });
        if (buildingCompare !== 0) {
          return buildingCompare;
        }
        return (a.floorNumber || 0) - (b.floorNumber || 0);
      });
  }, [buildings, rooms]);

  const bookRoomSelectedBuilding = useMemo(
    () => buildings.find((b) => String(b.id) === String(bookRoomSelectedBuildingId)),
    [buildings, bookRoomSelectedBuildingId]
  );

  const bookRoomFloors = useMemo(
    () => bookRoomSelectedBuilding?.floors || [],
    [bookRoomSelectedBuilding]
  );

  const bookRoomSelectedFloor = useMemo(
    () => bookRoomFloors.find((f) => String(f.id) === String(bookRoomSelectedFloorId)),
    [bookRoomFloors, bookRoomSelectedFloorId]
  );

  const bookRoomRooms = useMemo(() => {
    if (!bookRoomSelectedFloor) return [];
    return rooms.filter((r) => String(r.floorId) === String(bookRoomSelectedFloor.id));
  }, [rooms, bookRoomSelectedFloor]);

  useEffect(() => {
    const hasSelectedLocation = bookRoomLocationOptions.some(
      (option) =>
        option.buildingId === String(bookRoomSelectedBuildingId) &&
        option.floorId === String(bookRoomSelectedFloorId)
    );

    if (!hasSelectedLocation) {
      setBookRoomSelectedBuildingId(null);
      setBookRoomSelectedFloorId(null);
    }
  }, [bookRoomLocationOptions, bookRoomSelectedBuildingId, bookRoomSelectedFloorId]);

  useEffect(() => {
    if (!bookingForm.resourceId) {
      return;
    }

    const selectedRoomExists = rooms.some(
      (room) => String(room.id) === String(bookingForm.resourceId)
    );

    if (!selectedRoomExists) {
      setBookingForm((current) => ({
        ...current,
        resourceId: "",
      }));
      return;
    }

    if (!bookRoomSelectedFloor) {
      return;
    }

    const selectedRoomOnChosenFloor = bookRoomRooms.some(
      (room) => String(room.id) === String(bookingForm.resourceId)
    );

    if (!selectedRoomOnChosenFloor) {
      setBookingForm((current) => ({
        ...current,
        resourceId: "",
      }));
    }
  }, [rooms, bookRoomRooms, bookRoomSelectedFloor, bookingForm.resourceId]);

  return {
    bookingUserId,
    setBookingUserId,
    bookingForm,
    setBookingForm,
    bookingLoading,
    showBookingStatus,
    setShowBookingStatus,
    myBookings,
    adminBookings,
    adminBookingsLoading,
    adminBookingFilters,
    setAdminBookingFilters,
    loadMyBookings,
    handleSubmitBooking,
    handleCancelMyBooking,
    loadAdminBookings,
    handleAdminApprove,
    handleAdminReject,
    bookNotifications,
    bookUnreadCount,
    adminNotifications,
    clearBookNotifications,
    markBookNotificationsRead,
    clearAdminNotifications,
    bookRoomSelectedBuildingId,
    setBookRoomSelectedBuildingId,
    bookRoomSelectedFloorId,
    setBookRoomSelectedFloorId,
    bookRoomLocationOptions,
    bookRoomSelectedBuilding,
    bookRoomFloors,
    bookRoomSelectedFloor,
    bookRoomRooms,
  };
}
