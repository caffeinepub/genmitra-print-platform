import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useGetAllUsers, useGetUserOrderHistory } from '../../hooks/useQueries';
import type { UserProfile } from '../../backend';
import { Principal } from '@dfinity/principal';

function CustomerRow({ principal, profile }: { principal: Principal; profile: UserProfile }) {
  const [expanded, setExpanded] = useState(false);
  const { data: orders, isLoading } = useGetUserOrderHistory(expanded ? principal : null);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-sm">{profile.username}</p>
            <p className="text-xs text-muted-foreground">{profile.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{profile.phone}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-4">
          <h4 className="text-sm font-semibold mb-3">Order History</h4>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.orderId} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-lg">
                  <span className="font-medium">#{order.orderId.slice(-8)}</span>
                  <span className="text-muted-foreground">{order.status}</span>
                  <span className="font-semibold">₹{order.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CustomerManagementPage() {
  const { data: users, isLoading } = useGetAllUsers();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage customer accounts</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No customers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map(([principal, profile]) => (
            <CustomerRow
              key={principal.toString()}
              principal={principal}
              profile={profile}
            />
          ))}
        </div>
      )}
    </div>
  );
}
