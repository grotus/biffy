class FatReading < ActiveRecord::Base
  belongs_to :user
  scope :on,  ->(date) {where(entry_date: date)}
end
