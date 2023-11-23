
type Roles = "user" | "admin";
type Status = "active" | "inactive" | "pending" | "completed" | "canceled";
type DiscountStatus = Extract<Status, "active" | "inactive">;
type ShoppingSessionStatus = Extract<Status, "pending" | "completed" | "canceled">
type RefundStatus = "approved" | "pending"
type RefillStatus = "completed" | "pending"

// Payment Providers types
type PaymentProviders  = "mpesa" | "paypal";

export { Roles, Status, ShoppingSessionStatus, DiscountStatus, PaymentProviders, RefillStatus, RefundStatus};