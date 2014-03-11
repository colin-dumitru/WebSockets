WebSockets::Application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  get 'session/:id' => 'sessions#home'
  get 'session/:id/stream' => 'sessions#stream'
  get 'session/:id/message/:text' => 'sessions#message'

end
