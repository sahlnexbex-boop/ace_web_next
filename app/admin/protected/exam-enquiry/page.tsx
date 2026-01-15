export const getHallTicketByRegistrationId = (
  id: number
): Promise<Response> => {
  return apiRequest(
    `/api/exam-registration/hallticket/${id}`,
    "GET"
  ) as Promise<Response>;
};