FactoryBot.define do
  factory :circular do
    association :organization
    title { "テスト回覧板" }
    target_type { "all" }
    status { "draft" }

    trait :published do
      status { "published" }
      published_at { Time.current }
    end

    trait :leaders_only do
      target_type { "leaders" }
    end

    trait :scheduled do
      status { "published" }
      published_at { 1.day.from_now }
    end
  end
end
