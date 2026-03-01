import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllUsers, useGetAllOrders } from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';
import type { Principal } from '@dfinity/principal';

export default function CustomerManagementPage() {
  const { data: users, isLoading: usersLoading } = useGetAllUsers();
  const { data: allOrders } = useGetAllOrders();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const getUserOrders = (userId: Principal) => {
    return allOrders?.filter((o) => o.userId.toString() === userId.toString()) ?? [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-display">Customers</h2>
        <p className="text-muted-foreground mt-1">
          {users ? `${users.length} registered customer${users.length !== 1 ? 's' : ''}` : 'Loading...'}
        </p>
      </div>

      {usersLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
        </div>
      ) : !users || users.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card border border-border p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No customers yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Orders</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Joined</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">History</th>
                </tr>
              </thead>
              <tbody>
                {users.map(([principal, profile]) => {
                  const userOrders = getUserOrders(principal);
                  const isExpanded = expandedUser === principal.toString();
                  return (
                    <React.Fragment key={principal.toString()}>
                      <tr className="border-t border-border hover:bg-secondary/20">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">{profile.username}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{profile.email || '—'}</td>
                        <td className="py-3 px-4 text-muted-foreground">{profile.phone || '—'}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{userOrders.length}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {new Date(Number(profile.createdAt) / 1_000_000).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 rounded-lg hover:bg-primary/10 hover:text-primary"
                            onClick={() => setExpandedUser(isExpanded ? null : principal.toString())}
                          >
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </Button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-t border-border bg-secondary/10">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="pl-10">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Order History
                              </p>
                              {userOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No orders yet</p>
                              ) : (
                                <div className="space-y-2">
                                  {userOrders.map((order) => (
                                    <div key={order.orderId} className="flex items-center gap-4 text-sm">
                                      <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                                      <span className="font-mono text-xs text-foreground">
                                        #{order.orderId.slice(-8).toUpperCase()}
                                      </span>
                                      <span className="text-muted-foreground">{order.items.length} items</span>
                                      <span className="font-medium text-foreground">₹{order.total.toFixed(0)}</span>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        String(order.status) === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        {String(order.status)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
