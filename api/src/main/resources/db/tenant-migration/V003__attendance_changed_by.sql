-- Records who last changed an attendance row (ADR-0003), attributed from UserContext on every write.
ALTER TABLE attendances ADD COLUMN changed_by UUID;

UPDATE attendances SET changed_by = user_id WHERE changed_by IS NULL;

ALTER TABLE attendances ALTER COLUMN changed_by SET NOT NULL;
