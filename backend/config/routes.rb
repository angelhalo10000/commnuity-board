Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :viewer do
      resource :session, only: [ :show, :create, :destroy ]
      resources :notices, only: [ :index, :show ]
      resources :circulars, only: [ :index, :show ]
    end

    namespace :admin do
      resource :session, only: [ :show, :create, :destroy ]
      resources :notices
      resources :circulars, only: [ :index, :show, :create, :update, :destroy ]
      resource :settings, only: [ :show ] do
        patch :member_password, on: :collection
        patch :leader_password, on: :collection
        patch :admin_password, on: :collection
        patch :organization, on: :collection
      end
    end
  end
end
