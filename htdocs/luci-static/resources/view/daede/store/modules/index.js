import { defineStore } from 'pinia'
import { useDaeStore } from './dae.js'
import { useSystemStore } from './system.js'
import { useNetworkStore } from './network.js'
import { useSubscriptionStore } from './subscription.js'
import { useUpdateStore } from './update.js'

export const useStore = () => {
  const dae = useDaeStore()
  const system = useSystemStore()
  const network = useNetworkStore()
  const subscription = useSubscriptionStore()
  const update = useUpdateStore()

  return { dae, system, network, subscription, update }
}