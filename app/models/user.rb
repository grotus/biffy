class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :weight_readings, :dependent => :destroy do 
  	def by_date
  		select("id, weight, entry_date").order("entry_date DESC").map { |x| {entry_date: x.entry_date, bw_id: x.id, weight: x.weight} }
  	end
  	def by_date_map
  		select("id, weight, entry_date").order("entry_date DESC").map { |x| {x.entry_date => {entry_date: x.entry_date, bw_id: x.id, weight: x.weight}} }.reduce(:merge)
  	end
  end
  has_many :fat_readings, :dependent => :destroy do 
  	def by_date
  		select("id, percent, entry_date").order("entry_date DESC").map { |x| {entry_date: x.entry_date, bf_id: x.id, percent: x.percent} }
  	end
  	def by_date_map
  		select("id, percent, entry_date").order("entry_date DESC").map { |x| {x.entry_date => {entry_date: x.entry_date, bf_id: x.id, percent: x.percent}} }.reduce :merge
  	end
  end

  # What I would like to get out of this...
  # [..., { bw: {entry_date, bw_id, weight}, bf: nil }, ...]
  def collated_readings
  	bw = weight_readings.by_date_map
  	bf = fat_readings.by_date_map
  	bw.merge(bf) { |key, value_a, value_b| value_a.merge(value_b) }
  end

  def bio_entry_dates
  	dates = weight_readings.pluck(:entry_date).to_set.merge fat_readings.pluck(:entry_date).to_a
  end
end
