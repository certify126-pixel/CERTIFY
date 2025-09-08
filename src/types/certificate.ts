export interface CertificateForm {
  recipientName: string;
  certificateId: string;
  issueDate: Date;
  expiryDate?: Date;
  issuerName: string;
  certificateType: 'academic' | 'professional' | 'achievement';
  description: string;
}

export const certificateValidation = {
  recipientName: {
    required: 'Recipient name is required',
    pattern: {
      value: /^[a-zA-Z\s]{2,50}$/,
      message: 'Name must contain only letters and spaces (2-50 characters)'
    }
  },
  certificateId: {
    required: 'Certificate ID is required',
    pattern: {
      value: /^[A-Z0-9-]{8,}$/,
      message: 'ID must contain uppercase letters, numbers and hyphens only'
    }
  },
  issuerName: {
    required: 'Issuer name is required',
    pattern: {
      value: /^[a-zA-Z\s]{2,50}$/,
      message: 'Name must contain only letters and spaces (2-50 characters)'
    }
  },
  description: {
    required: 'Description is required',
    maxLength: {
      value: 500,
      message: 'Description cannot exceed 500 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9\s.,!?-]{10,}$/,
      message: 'Description contains invalid characters'
    }
  }
};