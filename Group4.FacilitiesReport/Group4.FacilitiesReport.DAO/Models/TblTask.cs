﻿using System;
using System.Collections.Generic;

namespace Group4.FacilitiesReport.DAO.Models
{
    public partial class TblTask
    {
        public int Id { get; set; }
        public Guid FeedbackId { get; set; }
        public string EmployeeId { get; set; } = null!;
        public string ManagerId { get; set; } = null!;
        public DateTime? DateTime { get; set; }
        public string ImgConfirmationUrl { get; set; } = null!;

        public virtual TblUser Employee { get; set; } = null!;
        public virtual TblFeedback Feedback { get; set; } = null!;
        public virtual TblUser Manager { get; set; } = null!;
    }
}
