﻿using Group4.FacilitiesReport.DTO;

namespace Group4.FacilitiesReport.Interface
{
    public interface IFeedback
    {
        public Task<List<DTO.Feedback>> GetFeedbackByUserId(string UserId);
        public Task<List<DTO.Feedback>> GetAllFeedBack();
        public Task<int> CountFeedbackByDate(DateTime beginDate, DateTime endDate);
        public Task<List<DTO.Feedback>> GetFeedbackByStatus(int status);
        public Task<List<DTO.Feedback>> GetFeedbackByLocation(string locationId);
        public Task<DTO.Feedback?> GetFeedback(Guid feedbackId);
        public Task<APIResponse> CreateFeedback(DTO.Feedback feedback);
        public Task<APIResponse> UpdateFeedback(DTO.FeedbackUpdatableObject feedback);
        public Task<APIResponse> NotifyFeedback(Guid feedbackID);
        public Task<APIResponse> UpdateFeedbackStatus(Guid feedbackId, int status);
        public Task<APIResponse> FeedbackResponse(Guid feedbackId, string response);
        public Task<APIResponse> RemoveFeedback(Guid feedbackId);
    }
}
